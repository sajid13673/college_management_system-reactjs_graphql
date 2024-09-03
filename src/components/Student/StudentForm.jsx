import { Autocomplete, Box, Button, Container, FormControl, Grid, Input, InputLabel, Modal, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { CREATE_STUDENT_MUTATION, UPDATE_STUDENT_MUTATION } from '../../Graphql/Mutations';
import { useMutation } from '@apollo/client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { LOAD_CLASSROOMS } from '../../Graphql/Queries';


function StudentForm(props) {
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
    setValue(newValue);
    };
    const handleDateChange = (value) => {
        let date = moment(value.toDate()).format("YYYY-MM-DD");
        formik.setFieldValue('date_of_birth', date)
    }
    const {error, loading, data} = useQuery(LOAD_CLASSROOMS)
    const [selectedValues, setSelectedValues] = useState([])
    const [classrooms, setClassrooms] = useState([])
    const [createStudent, {createErrors}] = useMutation(CREATE_STUDENT_MUTATION)
    const [updateStudent, {updateErrors}] = useMutation(UPDATE_STUDENT_MUTATION)
    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            email: '',
            password: '',
            phone_number: '',
            address: '',
            classrooms: [],
            date_of_birth: '',
        },
        onSubmit: (values) => {
            selectedValues.forEach(element => {
                values.classrooms.push(Number(element.id))
                console.log(element.id);
            });
            props.updateStatus ? updateStudent({variables: values}) : createStudent({variables: values});
        }
    })
    const handleAutocompleteChange = (event, value) => {
        console.log(value);
        setSelectedValues(value)
    }
    useEffect(()=>{
        if(props.updateStatus && props.student){
            setValue('2')
            formik.setFieldValue('id', props.student.id)
            formik.setFieldValue('name', props.student.name)
            formik.setFieldValue('phone_number', props.student.phone_number)
            formik.setFieldValue('address', props.student.address)
            formik.setFieldValue('date_of_birth', props.student.date_of_birth)
            setSelectedValues(props.student.classrooms)
        }
        else{
            setValue('1')
            formik.resetForm()
        }
    },[props.student, props.updateStatus])
    useEffect(()=>{
        data && console.log(data.classrooms);
        data && setClassrooms(data.classrooms);
    },[data])
  return (
    <Modal
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
    <Container  className="pa-2" maxWidth="sm" style={{ background: "white" }}>
    {/* <Tabs value={value} onChange={handleChange} aria-label="icon tabs example">
      <Tab icon={<AccountCircleIcon />} aria-label="phone" />
      <Tab icon={<LoginIcon />} aria-label="favorite" />
    </Tabs> */}
    <TabContext value={value}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
      <Tab icon={<AccountCircleIcon />}  value="1" disabled={props.updateStatus}/>
      <Tab icon={<LoginIcon />}  value="2" />
    </TabList>
  </Box>
  <form onSubmit={formik.handleSubmit}>
  <TabPanel  value="1">
  <Grid item={true} xs={12} >
                <Typography variant='h3'>{props.updateStatus ? 'UPDATE STUDENT' : 'CREATE STUDENT'}</Typography>
            </Grid>
          {/* <h1>Add Member</h1> */}
            <Grid container spacing={2}>
              <Grid item={true} xs={12} >
                <FormControl>
                  <InputLabel htmlFor="my-input">email</InputLabel>
                  <Input
                  error={formik.errors.email}
                    name="email"
                    type="text"
                    aria-describedby="my-helper-text"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email ? ( <div className="error">{formik.errors.email}</div> ) : null}
                </FormControl>
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl>
                    <InputLabel htmlFor="my-input">Password</InputLabel>
                    <Input
                    error={formik.errors.password}
                        name="password"
                        type="text"
                        aria-describedby="my-helper-text"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password ? ( <div className="error">{formik.errors.password}</div> ) : null}
                </FormControl>
              </Grid>
            </Grid>

  </TabPanel>
  <TabPanel value="2">
  <Grid item={true} xs={12} >
                <Typography variant='h3'>{props.updateStatus ? 'UPDATE STUDENT' : 'CREATE STUDENT'}</Typography>
            </Grid>
          {/* <h1>Add Member</h1> */}
            <Grid container spacing={2}>
              <Grid item={true} xs={12} >
                <FormControl>
                  <InputLabel htmlFor="my-input">Name</InputLabel>
                  <Input
                  error={formik.errors.name}
                    name="name"
                    type="text"
                    aria-describedby="my-helper-text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.name ? ( <div className="error">{formik.errors.name}</div> ) : null}
                </FormControl>
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl>
                    <InputLabel htmlFor="my-input">Phone Number</InputLabel>
                    <Input
                    error={formik.errors.phone_number}
                        name="phone_number"
                        type="text"
                        aria-describedby="my-helper-text"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.phone_number ? ( <div className="error">{formik.errors.phone_number}</div> ) : null}
                </FormControl>
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl>
                    <InputLabel htmlFor="my-input">Address</InputLabel>
                    <Input
                        error={formik.errors.phone_number}
                        name="address"
                        type="text"
                        aria-describedby="my-helper-text"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.address ? ( <div className="error">{formik.errors.address}</div> ) : null}
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12}>
                <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker label="Basic date picker" 
                        onChange={(newValue)=>handleDateChange(newValue)}
                        openTo='year'
                        format="DD/MM/YYYY"
                        value={props.student && dayjs(props.student.date_of_birth)}
                        />
                    </DemoContainer>
                    </LocalizationProvider>
                </FormControl>
                <Typography>Classrooms</Typography>
                {
                    props.student && props.student.classrooms.map((classroom) => (
                        <Button key={classroom.id}>{classroom.name}</Button>
                    ))
                }
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={classrooms}
                    getOptionLabel={(option) => option.name}
                    onChange={handleAutocompleteChange}
                    filterSelectedOptions
                    value={selectedValues}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="filterSelectedOptions"
                        placeholder="Classrooms"
                    />
                    )}
                />
              </Grid>
            <Button type='submit'>{props.updateStatus ? 'update' : 'create'}</Button>
  </TabPanel>
  </form>

</TabContext>
            
        </Container>
        </Modal>
  )
}

export default StudentForm