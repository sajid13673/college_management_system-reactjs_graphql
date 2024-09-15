import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_TEACHERS, GET_TEACHER_BY_ID } from "../../Graphql/Queries";
import TeacherTable from "./TeacherTable";
import { Button, Grid, Pagination, Stack } from "@mui/material";
import TeacherForm from "./TeacherForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function TeacherList({styledHeadTableCell, ErrorMessage, validateEmail}) {
  const [getTeachers, teachersResponse] = useLazyQuery(GET_ALL_TEACHERS);
  const [getTeacher, { error, loading, data }] =
    useLazyQuery(GET_TEACHER_BY_ID);
  const [teachers, setTeachers] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const handleEdit = (id) => {
    getTeacher({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
  };
  const hadlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  useEffect(() => {
    data && console.log(data.Teacher);
    data && setTeacher(data.Teacher);
    error && console.log(error);
  }, [data, error]);
  useEffect(() => {
    if (teachersResponse.data) {
      setTeachers(teachersResponse.data.Teachers.data);
      setLastPage(teachersResponse.data.Teachers.paginatorInfo.lastPage);
    }
    teachersResponse.data && console.log(teachersResponse.data.Teachers);
  }, [teachersResponse]);
  useEffect(() => {
    if (!open) {
      setUpdateStatus(false);
      setTeacher(null);
    }
  }, [open]);
  const handleGetTeachers = (refetch) => {
    console.log("get teachers");
    refetch
      ? teachersResponse.refetch()
      : getTeachers({
          variables: {
            first: 10,
            page: currentPage,
          },
        });
  };
  useEffect(() => {
    handleGetTeachers();
  }, [currentPage]);
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<PersonAddIcon />}
          onClick={() => setOpen(true)}
        >
          Create new teacher
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        minHeight={"60vh"}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TeacherTable
          teachers={teachers}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={styledHeadTableCell}
          handleGetTeachers={(refetch = true) => handleGetTeachers(refetch)}
        />
        <Stack spacing={2} sx={{ mt: "auto", mx: "auto" }}>
          <Pagination
            count={lastPage}
            shape="rounded"
            onChange={hadlePageChange}
          />
        </Stack>
      </Grid>
      <TeacherForm
        updateStatus={updateStatus}
        open={open}
        setOpen={(bool) => setOpen(bool)}
        teacher={teacher}
        ErrorMessage={ErrorMessage}
        validateEmail={(str) => validateEmail(str)}
        handleGetTeachers={(refetch = true) => handleGetTeachers(refetch)}
      />
    </Grid>
  );
}

export default TeacherList;
