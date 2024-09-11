import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { LOAD_CLASSROOMS, GET_CLASSROOM_BY_ID } from "../../Graphql/Queries";
import ClassroomTable from "./ClassroomTable";
import ClassroomForm from "./ClassroomForm";
import { Button, Grid, Icon, Pagination, Stack } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

function ClassroomList(props) {
  const [classrooms, setClassrooms] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [lastPage, setLastPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [getClassrooms , classroomsResponse] = useLazyQuery(LOAD_CLASSROOMS);
  const [getClassroom, { error, loading, data }] =
    useLazyQuery(GET_CLASSROOM_BY_ID);
  const [open, setOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const hadlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  const handleEdit = (id) => {
    getClassroom({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
  };
  useEffect(() => {
    data && console.log(data.classroom);
    data && setClassroom(data.classroom);
  }, [data]);
  useEffect(() => {
    if(classroomsResponse.data){
      setClassrooms(classroomsResponse.data.classrooms.data);
      setLastPage(classroomsResponse.data.classrooms.paginatorInfo.lastPage)
    }
    classroomsResponse &&
      classroomsResponse.error &&
      console.log(classroomsResponse.error);
  }, [classroomsResponse]);
  useEffect(() => {
    console.log(classroom);
    if (!open) {
      setUpdateStatus(false);
      setClassroom(null);
    }
  }, [open]);
  useEffect(()=>{
    getClassrooms({variables:{
      first: 10,
      page: currentPage
    }})
  },[currentPage])
  return (
    <Grid container spacing={2} sx={{ p: 2}}>
      <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<AddBoxIcon />}
          onClick={() => setOpen(true)}
        >
          create new classroom{" "}
        </Button>
      </Grid>
      <Grid item xs={12} minHeight={'60vh'} sx={{ display: 'flex', flexDirection: 'column' , gap:2}}>
        <ClassroomTable
          classrooms={classrooms}
          setOpen={(bool) => setOpen(bool)}
          setUpdateStatus={(bool) => setUpdateStatus(bool)}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={props.styledHeadTableCell}
        />
        <Stack spacing={2} sx={{ mt: 'auto', mx: 'auto'}}>
          <Pagination count={lastPage} shape="rounded" onChange={hadlePageChange} />
        </Stack>
      </Grid>
      <ClassroomForm
        open={open}
        setOpen={(status) => setOpen(status)}
        updateStatus={updateStatus}
        classroom={classroom}
      />
    </Grid>
  );
}

export default ClassroomList;
