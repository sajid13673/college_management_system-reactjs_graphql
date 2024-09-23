import { Grid } from '@mui/material'
import React from 'react'
import ClassroomCard from './ClassroomCard';

function UserClassroomList({user}) {
    console.log(user);
    const role = user?.teacher ?? user?.student;
    console.log(role);
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid container item xs={12} spacing={2}>
        {role && role.classrooms.map((classroom)=>(
            <ClassroomCard key={classroom.id} id={classroom.id} name={classroom.name} year={classroom.year}/>
        ))}
      </Grid>
    </Grid>
  )
}
export default UserClassroomList