import { Grid, Typography } from '@mui/material'
import React from 'react'
import ClassroomCard from './ClassroomCard';

function UserClassroomList({user}) {
    console.log(user);
    // Assigning the user type to get the data of the current user type
    const role = user?.teacher ?? user?.student;
    console.log(role);
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid container item xs={12} spacing={2}>
        {(role && role.classrooms.length > 0) && role.classrooms.map((classroom)=>(
            <ClassroomCard key={classroom.id} id={classroom.id} name={classroom.name} year={classroom.year}/>
        ))}
        {role?.classrooms.length == 0 && <Typography sx={{ mx: 'auto', mt: 8 }} variant='h5'>No classrooms found</Typography>}
      </Grid>
    </Grid>
  )
}
export default UserClassroomList