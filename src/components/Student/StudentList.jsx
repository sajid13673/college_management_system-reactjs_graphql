import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_STUDENTS, GET_STUDENT_BY_ID } from "../../Graphql/Queries";
import StudentTable from "./StudentTable";
import { Button, CircularProgress, Grid, Pagination, Stack } from "@mui/material";
import StudentForm from "./StudentForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useAuth } from "../../utils/authProvider";

function StudentList(props) {
  const [getStudents, studentsResponse] = useLazyQuery(GET_ALL_STUDENTS);
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
    if(studentsResponse.data){
      setStudents(studentsResponse.data.Students.data);
      setLastPage(studentsResponse.data.Students.paginatorInfo.lastPage)
      setCurrentPage(studentsResponse.data.Students.paginatorInfo.currentPage)
    }
    studentsResponse.data && console.log(studentsResponse.data.Students);
  }, [studentsResponse]);
  useEffect(() => {
    if (!open) {
      setUpdateStatus(false);
      setStudent(null);
    }
  }, [open]);
  const handleGetStudents = (refetch) => {
    console.log("get students");
    refetch ? studentsResponse.refetch() :
    getStudents({variables:{
      first: 10,
      page: currentPage
    }})
  }
  useEffect(()=>{
    handleGetStudents()
  },[currentPage])
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      
     {studentsResponse.loading ? 
     (
      <Grid item xs={12} sx={{ display: "flex", mt:20 }}>
        <CircularProgress
          sx={{ mx: "auto" }}
          thickness={6}
          size={200}
          variant="indeterminate"
        ></CircularProgress>
      </Grid>
    ):
     (<>
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
          handleGetStudents = {(refetch = true) => handleGetStudents(refetch)} 
          />
        <Stack spacing={2} sx={{ mt: 'auto', mx: 'auto'}}>
          <Pagination count={lastPage} page={currentPage} shape="rounded" onChange={hadlePageChange} />
        </Stack>
      </Grid>
      </>)}
      <StudentForm
        updateStatus={updateStatus}
        open={open}
        setOpen={(bool) => setOpen(bool)}
        student={student}
        validateEmail = {(str) => props.validateEmail(str)}
        ErrorMessage = {props.ErrorMessage}
        handleGetStudents = {(refetch = true) => handleGetStudents(refetch)} 
        modalBoxstyle = {props.modalBoxstyle}
        />
    </Grid>
  );
}

export default StudentList;
