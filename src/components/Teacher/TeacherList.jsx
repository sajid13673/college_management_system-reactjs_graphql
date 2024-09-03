import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_TEACHERS, GET_TEACHER_BY_ID } from "../../Graphql/Queries";
import TeacherTable from "./TeacherTable";
import { Button, Grid } from "@mui/material";
import TeacherForm from "./TeacherForm";

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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button onClick={() => setOpen(true)}>Create</Button>
      </Grid>
      <Grid item xs={12} padding={2}>
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
