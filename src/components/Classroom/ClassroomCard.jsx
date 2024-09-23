import { CardActions } from '@material-ui/core'
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ClassroomCard({id,name, year}) {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card variant="outlined" sx={{ minHeight: '10rem', p:1, display: 'flex', flexDirection: 'column' }}>
        <CardContent>
            <Typography variant='h6' sx={{textTransform: 'uppercase' }}>
               {`${name} - ${year}`} 
            </Typography>
        </CardContent>
        <CardActions sx={{ mt:'auto' }} style={{ marginTop:'auto' }}>
            <Button variant='contained' sx={{ mt: 'auto' }} onClick={()=>navigate(`/classroom/${id}`)}>Open</Button>
        </CardActions>
    </Card>
    </Grid>
  )
}

export default ClassroomCard