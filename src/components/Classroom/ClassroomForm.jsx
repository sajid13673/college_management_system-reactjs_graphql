import {
  Button,
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Modal,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import {
  CREATE_CLASSROOM_MUTATION,
  UPDATE_CLASSROOM_MUTATION,
} from "../../Graphql/Mutations";
import { useMutation } from "@apollo/client";

function ClassroomForm({updateStatus, classroom, open, setOpen}) {
  const [createClassroom, { createErrors }] = useMutation(
    CREATE_CLASSROOM_MUTATION
  );
  const [updateClassroom, { updateErrors }] = useMutation(
    UPDATE_CLASSROOM_MUTATION
  );
  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      year: "",
    },
    onSubmit: (values) => {
      updateStatus
        ? updateClassroom({ variables: values })
        : createClassroom({ variables: values });
    },
  });
  useEffect(() => {
    if (updateStatus && classroom) {
      formik.setFieldValue("id", classroom.id);
      formik.setFieldValue("name", classroom.name);
      formik.setFieldValue("year", classroom.year);
    } else {
      formik.resetForm();
    }
  }, [classroom]);
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
                  error={formik.errors.name}
                  name="name"
                  type="text"
                  aria-describedby="my-helper-text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.errors.name ? (
                  <div className="error">{formik.errors.name}</div>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item={true} xs={12}>
              <FormControl>
                <InputLabel htmlFor="my-input">Year</InputLabel>
                <Input
                  error={formik.errors.year}
                  name="year"
                  type="text"
                  aria-describedby="my-helper-text"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                />
                {formik.errors.year ? (
                  <div className="error">{formik.errors.year}</div>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit">
            {updateStatus ? "update" : "create"}
          </Button>
        </form>
      </Container>
    </Modal>
  );
}

export default ClassroomForm;
