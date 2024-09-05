import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_TEACHERS, GET_TEACHER_BY_ID } from "../../Graphql/Queries";
import TeacherTable from "./TeacherTable";
import { Button, Grid } from "@mui/material";
import TeacherForm from "./TeacherForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function TeacherList(props) {
  const teachersResponse = useQuery(GET_ALL_TEACHERS);
  const [getTeacher, { error, loading, data }] =
    useLazyQuery(GET_TEACHER_BY_ID);
  const [teachers, setTeachers] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const handleEdit = (id) => {
    getTeacher({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
  };
  useEffect(() => {
    data && console.log(data.Teacher);
    data && setTeacher(data.Teacher);
    error && console.log(error);
  }, [data, error]);
  useEffect(() => {
    teachersResponse.data && setTeachers(teachersResponse.data.Teachers);
    teachersResponse.data && console.log(teachersResponse.data.Teachers);
  }, [teachersResponse]);
  useEffect(() => {
    if (!open) {
      setUpdateStatus(false);
      setTeacher(null);
    }
  }, [open]);
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<PersonAddIcon/>}
          onClick={() => setOpen(true)}
        >
          Create new teacher
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TeacherTable
          teachers={teachers}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={props.styledHeadTableCell}
        />
      </Grid>
      <TeacherForm
        updateStatus={updateStatus}
        open={open}
        setOpen={(bool) => setOpen(bool)}
        teacher={teacher}
      />
    </Grid>
  );
}

export default TeacherList;
