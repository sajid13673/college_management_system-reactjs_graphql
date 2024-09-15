import {
  Button,
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Modal,
  styled,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  CREATE_CLASSROOM_MUTATION,
  UPDATE_CLASSROOM_MUTATION,
} from "../../Graphql/Mutations";
import { useMutation } from "@apollo/client";
import { validate } from "graphql";
import moment from "moment";

function ClassroomForm({
  updateStatus,
  classroom,
  open,
  setOpen,
  ErrorMessage,
  handlegetClassrooms,
}) {
  const [createClassroom, createResponse] = useMutation(
    CREATE_CLASSROOM_MUTATION
  );
  const [updateClassroom, updateResponse] = useMutation(
    UPDATE_CLASSROOM_MUTATION
  );
  const validate = (values) => {
    let errors = {};
    const maxYear = parseInt(moment().format("YYYY")) + 5;
    const minYear = parseInt(moment().format("YYYY")) - 10;
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.year) {
      errors.year = "Requireds";
    } else if (!/^[0-9]*$/.test(values.year) || values.year.length !== 4) {
      errors.year = `Please enter a valid year, eg:- ${moment().format(
        "YYYY"
      )}`;
    } else if (values.year > maxYear || values.year < minYear) {
      errors.year = `Please enter an year between ${minYear} - ${maxYear}`;
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      year: "",
    },
    validate: validate,
    onSubmit: (values) => {
      updateStatus
        ? updateClassroom({ variables: values })
        : createClassroom({ variables: values });
    },
  });
  useEffect(() => {
    if (updateStatus && classroom) {
      formik.setValues({
        ...formik.values,
        name: classroom.name,
        year: classroom.year,
      });
    } else {
      formik.resetForm();
    }
  }, [classroom]);
  useEffect(() => {
    if (createResponse.error || updateResponse.error) {
      const validationErr = createResponse.error
        ? createResponse.error.graphQLErrors[0].extensions?.validation
        : updateResponse.error.graphQLErrors[0].extensions?.validation;
      validationErr && formik.setFieldError("name", "Name already exists");
    }
    createResponse.data && console.log("createResponse.data");
    (createResponse.data || updateResponse.data) &&
      (handlegetClassrooms(), setOpen(false));
  }, [
    createResponse.error,
    createResponse.data,
    updateResponse.data,
    updateResponse.error,
  ]);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container className="pa-2" maxWidth="sm" style={{ background: "white" }}>
        <Grid item={true} xs={12}>
          <Typography variant="h3">
            {updateStatus ? "UPDATE CLASSROOM" : "CREATE CLASSROOM"}
          </Typography>
        </Grid>
        {/* <h1>Add Member</h1> */}
        <form onSubmit={formik.handleSubmit}>
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
                <InputLabel htmlFor="my-input">Year</InputLabel>
                <Input
                  error={"year" in formik.errors}
                  name="year"
                  type="text"
                  aria-describedby="my-helper-text"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                />
                {formik.errors.year ? (
                  <ErrorMessage>{formik.errors.year}</ErrorMessage>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit">{updateStatus ? "update" : "create"}</Button>
        </form>
      </Container>
    </Modal>
  );
}

export default ClassroomForm;
