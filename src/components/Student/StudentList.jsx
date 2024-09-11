import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_STUDENTS, GET_STUDENT_BY_ID } from "../../Graphql/Queries";
import StudentTable from "./StudentTable";
import { Button, Grid, Pagination, Stack } from "@mui/material";
import StudentForm from "./StudentForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../../utils/authProvider";

function StudentList(props) {
  const [getStudents, StudentsResponse] = useLazyQuery(GET_ALL_STUDENTS);
  const [getStudent, { error, loading, data }] =
    useLazyQuery(GET_STUDENT_BY_ID);
  const [students, setStudents] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [lastPage, setLastPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const {token} = useAuth()
  const handleEdit = (id) => {
    getStudent({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
  };
  const hadlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  useEffect(() => {
    data && console.log(data.Student);
    data && setStudent(data.Student);
    error && console.log(error);
  }, [data, error]);
  useEffect(() => {
    if(StudentsResponse.data){
      setStudents(StudentsResponse.data.Students.data);
      setLastPage(StudentsResponse.data.Students.paginatorInfo.lastPage)
    }
    StudentsResponse.data && console.log(StudentsResponse.data.Students);
  }, [StudentsResponse]);
  useEffect(() => {
    if (!open) {
      setUpdateStatus(false);
      setStudent(null);
    }
  }, [open]);
  useEffect(()=>{
    getStudents({variables:{
      first: 10,
      page: currentPage
    }})
  },[currentPage])
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {token.role == 'admin' && <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<PersonAddIcon/>}
          onClick={() => setOpen(true)}
        >
          Create new student
        </Button>
      </Grid>}
      <Grid item xs={12} minHeight={'60vh'} sx={{ display: 'flex', flexDirection: 'column', gap:2 }}>
        <StudentTable
          students={students}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={props.styledHeadTableCell}
        />
        <Stack spacing={2} sx={{ mt: 'auto', mx: 'auto'}}>
          <Pagination count={lastPage} shape="rounded" onChange={hadlePageChange} />
        </Stack>
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
