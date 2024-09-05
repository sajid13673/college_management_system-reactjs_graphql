import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { LOAD_CLASSROOMS, GET_CLASSROOM_BY_ID } from "../../Graphql/Queries";
import ClassroomTable from "./ClassroomTable";
import ClassroomForm from "./ClassroomForm";
import { Button, Grid, Icon } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';

function ClassroomList(props) {
  const [classrooms, setClassrooms] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const classroomsResponse = useQuery(LOAD_CLASSROOMS);
  const [getClassroom, { error, loading, data }] =
    useLazyQuery(GET_CLASSROOM_BY_ID);
  const [open, setOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const handleEdit = (id) => {
    getClassroom({ variables: { id: id } });
    setUpdateStatus(true);
    setOpen(true);
    console.log(id);
  };
  useEffect(() => {
    data && console.log(data.classroom);
    data && setClassroom(data.classroom);
  }, [data]);
  useEffect(() => {
    classroomsResponse &&
      classroomsResponse.data &&
      setClassrooms(classroomsResponse.data.classrooms);
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
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          endIcon={<AddBoxIcon/>}
          onClick={() => setOpen(true)}
        >
          create new classroom{" "}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <ClassroomTable
          classrooms={classrooms}
          setOpen={(bool) => setOpen(bool)}
          setUpdateStatus={(bool) => setUpdateStatus(bool)}
          handleEdit={(id) => handleEdit(id)}
          styledHeadTableCell={props.styledHeadTableCell}
        />
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
