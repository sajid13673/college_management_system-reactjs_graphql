import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_STUDENTS, GET_STUDENT_BY_ID } from "../../Graphql/Queries";
import StudentTable from "./StudentTable";
import { Button, Grid } from "@mui/material";
import StudentForm from "./StudentForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function StudentList(props) {
  const StudentsResponse = useQuery(GET_ALL_STUDENTS);
  const [getStudent, { error, loading, data }] =
    useLazyQuery(GET_STUDENT_BY_ID);
  const [students, setStudents] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const handleEdit = (id) => {
    getStudent({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
  };
  useEffect(() => {
    data && console.log(data.Student);
    data && setStudent(data.Student);
    error && console.log(error);
  }, [data, error]);
  useEffect(() => {
    StudentsResponse.data && setStudents(StudentsResponse.data.Students);
    StudentsResponse.data && console.log(StudentsResponse.data.Students);
  }, [StudentsResponse]);
  useEffect(() => {
    if (!open) {
      setUpdateStatus(false);
      setStudent(null);
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
          Create new student
        </Button>
      </Grid>
      <Grid item xs={12}>
        <StudentTable
          students={students}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={props.styledHeadTableCell}
        />
      </Grid>
      <StudentForm
        updateStatus={updateStatus}
        open={open}
        setOpen={(bool) => setOpen(bool)}
        student={student}
      />
    </Grid>
  );
}

export default StudentList;
