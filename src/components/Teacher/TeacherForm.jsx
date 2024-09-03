import { Autocomplete, Box, Button, Container, FormControl, Grid, Input, InputLabel, Modal, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { CREATE_TEACHER_MUTATION, UPDATE_TEACHER_MUTATION } from '../../Graphql/Mutations';
import { useMutation } from '@apollo/client';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useQuery } from '@apollo/client';
import { LOAD_CLASSROOMS } from '../../Graphql/Queries';

function TeacherForm(props) {
    const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {error, loading, data} = useQuery(LOAD_CLASSROOMS)
  const [classrooms, setClassrooms] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  const [createTeacher, {createErrors}] = useMutation(CREATE_TEACHER_MUTATION)
    const [updateTeacher, {updateErrors}] = useMutation(UPDATE_TEACHER_MUTATION)
    const options = classrooms.map(option => ({ id: option.id, label: option.name + ` (${option.year})`}));
    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            email: '',
            password: '',
            phone_number: '',
            address: '',
            classrooms: [],
        },
        onSubmit: (values) => {
            selectedValues.forEach(element => {
                values.classrooms.push(Number(element.id))
                console.log(element.id);
            });
            console.log(values);
            props.updateStatus ? updateTeacher({variables: values}) : createTeacher({variables: values});
        }
    })
    const handleAutocompleteChange = (event, value) => {
        console.log(value);
        setSelectedValues(value)
    }
    useEffect(()=>{
        if(props.updateStatus && props.teacher){
            setValue('2')
            formik.setFieldValue('id', props.teacher.id)
            formik.setFieldValue('name', props.teacher.name)
            formik.setFieldValue('phone_number', props.teacher.phone_number)
            formik.setFieldValue('address', props.teacher.address)
            setSelectedValues(props.teacher.classrooms)
        }
        else{
            setValue('1')
            formik.resetForm()
        }
    },[props.teacher, props.updateStatus])
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
                <Typography variant='h3'>{props.updateStatus ? 'UPDATE TEACHER' : 'CREATE TEACHER'}</Typography>
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
                <Typography variant='h3'>{props.updateStatus ? 'UPDATE TEACHER' : 'CREATE TEACHER'}</Typography>
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
            <Typography>Classrooms</Typography>
                {
                    props.teacher && props.teacher.classrooms.map((classroom) => (
                        <Button key={classroom.id}>{classroom.name}</Button>
                    ))
                }
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={classrooms}
                    getOptionLabel={(option) => option.name}
                    onChange={handleAutocompleteChange}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
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
            <Button type='submit'>{props.updateStatus ? 'update' : 'create'}</Button>
  </TabPanel>
  </form>

</TabContext>
            
        </Container>
        </Modal>
  )
}

export default TeacherForm