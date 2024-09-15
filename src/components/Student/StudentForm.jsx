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
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  CREATE_STUDENT_MUTATION,
  UPDATE_STUDENT_MUTATION,
} from "../../Graphql/Mutations";
import { useMutation } from "@apollo/client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment/moment";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { LOAD_CLASSROOMS } from "../../Graphql/Queries";

function StudentForm({
  updateStatus,
  student,
  open,
  setOpen,
  ErrorMessage,
  validateEmail,
  handleGetStudents,
}) {
  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleDateChange = (value, error) => {
    error.validationError && console.log(error.validationError);
    error.validationError &&
      formik.setFieldError("date_of_birth", "Invalide date", false);
    let date = moment(value.toDate()).format("YYYY-MM-DD");
    formik.setFieldValue("date_of_birth", date);
  };
  const { error, loading, data } = useQuery(LOAD_CLASSROOMS);
  const [selectedValues, setSelectedValues] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [createStudent, createResponse] = useMutation(CREATE_STUDENT_MUTATION);
  const [updateStudent, updateResponse] = useMutation(UPDATE_STUDENT_MUTATION);
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
      errors.phone_number = `Please enter a valid year, eg:- 0777123456`;
    }
    if (!values.address) {
      errors.address = "Required";
    }
    if (!values.date_of_birth) {
      errors.date_of_birth = "Required";
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
      date_of_birth: "",
    },
    validate: validate,
    onSubmit: (values) => {
      selectedValues.forEach((element) => {
        values.classrooms.push(Number(element.id));
        console.log(element.id);
      });
      updateStatus
        ? updateStudent({ variables: values })
        : createStudent({ variables: values });
    },
  });
  const handleAutocompleteChange = (event, value) => {
    console.log(value);
    setSelectedValues(value);
  };
  useEffect(() => {
    if (updateStatus && student) {
      setTabValue("2");
      formik.setValues({
        ...formik.values,
        id: student.id,
        name: student.name,
        phone_number: student.phone_number,
        address: student.address,
        date_of_birth: student.date_of_birth,
      });
      setSelectedValues(student.classrooms);
    } else {
      setTabValue("1");
    }
  }, [student, updateStatus]);
  useEffect(() => {
    data && console.log(data.classrooms);
    data && setClassrooms(data.classrooms);
    error && console.log(error.message);
  }, [data, error]);
  useEffect(() => {
    if (createResponse.error || updateResponse.error) {
      const validationErr = createResponse.error
        ? createResponse.error.graphQLErrors[0].extensions?.validation
        : updateResponse.error.graphQLErrors[0].extensions?.validation;
      if (validationErr) {
        validationErr["input.user.create.email"] &&
          (formik.setFieldError("email", "Email already exists"),
          setTabValue("1"));
        validationErr["input.phone_number"] &&
          formik.setFieldError("phone_number", "Phone number already exists");
      }
    }
    createResponse.data && console.log("createResponse.data");
    (createResponse.data || updateResponse.data) &&
      (console.log("response.data"), handleGetStudents(), setOpen(false));
  }, [
    createResponse.error,
    createResponse.data,
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
                  {updateStatus ? "UPDATE STUDENT" : "CREATE STUDENT"}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item={true} xs={12}>
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
                    {formik.errors.email ? (
                      <ErrorMessage>{formik.errors.email}</ErrorMessage>
                    ) : null}
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
                  {updateStatus ? "UPDATE STUDENT" : "CREATE STUDENT"}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item={true} xs={12}>
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
                    {formik.errors.name ? (
                      <ErrorMessage>{formik.errors.name}</ErrorMessage>
                    ) : null}
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
                    {formik.errors.phone_number ? (
                      <ErrorMessage>{formik.errors.phone_number}</ErrorMessage>
                    ) : null}
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
                    {formik.errors.address ? (
                      <ErrorMessage>{formik.errors.address}</ErrorMessage>
                    ) : null}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Basic date picker"
                        onChange={(newValue, error) =>
                          handleDateChange(newValue, error)
                        }
                        openTo="year"
                        format="DD/MM/YYYY"
                        value={student && dayjs(student.date_of_birth)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  {formik.errors.date_of_birth ? (
                    <ErrorMessage>{formik.errors.date_of_birth}</ErrorMessage>
                  ) : null}
                </FormControl>
                <Typography>Classrooms</Typography>
                {student &&
                  student.classrooms.map((classroom) => (
                    <Button key={classroom.id}>{classroom.name}</Button>
                  ))}
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

export default StudentForm;
