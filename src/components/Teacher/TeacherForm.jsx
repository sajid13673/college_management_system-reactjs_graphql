import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Modal,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  CREATE_TEACHER_MUTATION,
  UPDATE_TEACHER_MUTATION,
} from "../../Graphql/Mutations";
import { useMutation } from "@apollo/client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useQuery } from "@apollo/client";
import { LOAD_CLASSROOMS } from "../../Graphql/Queries";

function TeacherForm({
  teacher,
  updateStatus,
  open,
  setOpen,
  ErrorMessage,
  validateEmail,
  handleGetTeachers,
}) {
  const [tabValue, setTabValue] = useState("1");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const { error, loading, data } = useQuery(LOAD_CLASSROOMS);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [createTeacher, createResonse] = useMutation(CREATE_TEACHER_MUTATION);
  const [updateTeacher, updateResponse] = useMutation(UPDATE_TEACHER_MUTATION);
  let errors = {};
  const validate = (values) => {
    if (!updateStatus) {
      if (!values.email) {
        errors.email = "Required";
      } else if (validateEmail(values.email)) {
        errors.email = "Please enter a valid email";
      }
      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 8) {
        errors.password = "Password should have minimum 8 characters";
      }
    }
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.phone_number) {
      errors.phone_number = "Required";
    } else if (
      !/^[0-9]*$/.test(values.phone_number) ||
      values.phone_number.length < 10 ||
      values.phone_number.length > 13
    ) {
      errors.phone_number = `Enter a valid phone number, eg:- 0777123456`;
    }
    if (!values.address) {
      errors.address = "Required";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
      classrooms: [],
    },
    validate: validate,
    onSubmit: (values) => {
      selectedValues.forEach((element) => {
        values.classrooms.push(Number(element.id));
        console.log(element.id);
      });
      console.log(values);
      updateStatus
        ? updateTeacher({ variables: values })
        : createTeacher({ variables: values });
    },
  });
  const handleAutocompleteChange = (event, value) => {
    console.log(value);
    setSelectedValues(value);
  };
  useEffect(() => {
    if (updateStatus && teacher) {
      setTabValue("2");
      // formik.setFieldValue("id", teacher.id);
      // formik.setFieldValue("name", teacher.name);
      // formik.setFieldValue("phone_number", teacher.phone_number);
      // formik.setFieldValue("address", teacher.address);
      formik.setValues({
        ...formik.values,
        id: teacher.id,
        name: teacher.name,
        phone_number: teacher.phone_number,
        address: teacher.address,
      });
      setSelectedValues(teacher.classrooms);
    } else {
      setTabValue("1");
      formik.resetForm();
    }
  }, [teacher, updateStatus]);
  useEffect(() => {
    data && console.log(data.classrooms);
    data && setClassrooms(data.classrooms);
    error && console.log(error.message);
  }, [data, error]);
  useEffect(() => {
    if (createResonse.error || updateResponse.error) {
      const validationErr = createResonse.error
        ? createResonse.error.graphQLErrors[0].extensions?.validation
        : updateResponse.error.graphQLErrors[0].extensions?.validation;
      if (validationErr) {
        validationErr["input.user.create.email"] &&
          (formik.setFieldError("email", "Email already exists"),
          setTabValue("1"));
        validationErr["input.phone_number"] &&
          formik.setFieldError("phone_number", "Phone number already exists");
      }
    }
    (createResonse.data || updateResponse.data) &&
      (console.log(createResonse.data), handleGetTeachers(), setOpen(false));
  }, [
    createResonse.error,
    createResonse.data,
    updateResponse.data,
    updateResponse.error,
  ]);
  useEffect(() => {
    open &&
      (console.log(formik.values.classrooms), console.log(selectedValues));
    !open &&
      ((formik.values.classrooms.length = 0),
      formik.resetForm(),
      setSelectedValues([]));
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container className="pa-2" maxWidth="sm" style={{ background: "white" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
            >
              <Tab
                icon={<AccountCircleIcon />}
                value="1"
                disabled={updateStatus}
              />
              <Tab icon={<LoginIcon />} value="2" />
            </TabList>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <TabPanel value="1">
              <Grid item={true} xs={12}>
                <Typography variant="h3">
                  {updateStatus ? "UPDATE TEACHER" : "CREATE TEACHER"}
                </Typography>
              </Grid>
              {/* <h1>Add Member</h1> */}
              <Grid container spacing={2}>
                <Grid item={true} xs={12}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">email</InputLabel>
                    <Input
                      error={"email" in formik.errors}
                      name="email"
                      type="text"
                      aria-describedby="my-helper-text"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.email ? (
                      <ErrorMessage>{formik.errors.email}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">Password</InputLabel>
                    <Input
                      error={"password" in formik.errors}
                      name="password"
                      type="text"
                      aria-describedby="my-helper-text"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.password ? (
                      <ErrorMessage>{formik.errors.password}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <Grid item={true} xs={12}>
                <Typography variant="h3">
                  {updateStatus ? "UPDATE TEACHER" : "CREATE TEACHER"}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item={true} xs={12}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">Name</InputLabel>
                    <Input
                      error={"name" in formik.errors}
                      name="name"
                      type="text"
                      aria-describedby="my-helper-text"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.name ? (
                      <ErrorMessage>{formik.errors.name}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">Phone Number</InputLabel>
                    <Input
                      error={"phone_number" in formik.errors}
                      name="phone_number"
                      type="text"
                      aria-describedby="my-helper-text"
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.phone_number ? (
                      <ErrorMessage>{formik.errors.phone_number}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControl>
                    <InputLabel htmlFor="my-input">Address</InputLabel>
                    <Input
                      error={"address" in formik.errors}
                      name="address"
                      type="text"
                      aria-describedby="my-helper-text"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.address ? (
                      <ErrorMessage>{formik.errors.address}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
              </Grid>
              {/* <Typography>Classrooms</Typography>
              {teacher &&
                teacher.classrooms.map((classroom) => (
                  <Button key={classroom.id}>{classroom.name}</Button>
                ))} */}
              <Grid item={true} xs={12}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={classrooms}
                  getOptionLabel={(option) => option.name}
                  onChange={handleAutocompleteChange}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions
                  value={selectedValues}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Classrooms"
                      placeholder="Classrooms"
                    />
                  )}
                />
              </Grid>
              <Button type="submit">
                {updateStatus ? "update" : "create"}
              </Button>
            </TabPanel>
          </form>
        </TabContext>
      </Container>
    </Modal>
  );
}

export default TeacherForm;
