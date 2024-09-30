import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  styled,
  Tab,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLASS_MATERIAL,
  CREATE_CLASS_NOTE,
  DELETE_CLASS_MATERIAL,
  DELETE_CLASS_NOTE,
} from "../../Graphql/Mutations";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  GET_CLASS_NOTE_BY_ID,
  GET_CLASSROOM_BY_ID,
} from "../../Graphql/Queries";
import { useFormik } from "formik";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAuth } from "../../utils/authProvider";
import CloseIcon from "@mui/icons-material/Close";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function ClassroomInfo({ StyledTabBox, textAreaStyle }) {
  const { token } = useAuth();
  const { id } = useParams();
  const { data, error, loading, refetch } = useQuery(GET_CLASSROOM_BY_ID, {
    variables: { id: id },
  });
  const [classroom, setClassroom] = useState();
  const materialsFormik = useFormik({
    initialValues: {
      classroom_id: id,
      name: "",
      description: "",
      file: null,
    },
    onSubmit: (values) => {
      createClassMaterial({ variables: values });
    },
  });
  const [tabValue, setTabValue] = useState("1");
  const [createClassMaterial, classMaterialResponse] = useMutation(
    CREATE_CLASS_MATERIAL
  );
  const [deleteClassMaterial, deleteClassMaterialResponse] = useMutation(
    DELETE_CLASS_MATERIAL
  );
  const [createClassNote, createClassNoteResponse] =
    useMutation(CREATE_CLASS_NOTE);
  const [deleteClassNote, deleteClassNoteResponse] =
    useMutation(DELETE_CLASS_NOTE);
  const [getClassNote, getClassNoteResponse] =
    useLazyQuery(GET_CLASS_NOTE_BY_ID);
  const [readStatus, setReadStatus] = useState(false);
  const [classNote, setClassNote] = useState();
  const notesFormik = useFormik({
    initialValues: {
      classroom_id: id,
      title: "",
      description: "",
    },
    onSubmit: (values) => {
      console.log(values);
      createClassNote({ variables: values });
    },
  });
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    materialsFormik.setFieldValue(event.target.name, file);
  };
  const handleRead = (id) => {
    getClassNote({ variables: { id: id } });
    setReadStatus(true);
    // id !== readId ? setReadId(id) : getClassNoteResponse.refetch();
  };
  // useEffect(()=>{
  //   getClassNote({variables:{id: readId}})
  // },[readId])
  useEffect(() => {
    data && setClassroom(data.classroom);
    data && console.log(data.classroom);
  }, [data, error]);

  useEffect(() => {
    classMaterialResponse.data && (refetch(), materialsFormik.resetForm());
    classMaterialResponse.error &&
      console.log(classMaterialResponse.error.message);
    deleteClassMaterialResponse.data && refetch();
    deleteClassMaterialResponse.error &&
      console.log(deleteClassMaterialResponse.error.message);
  }, [
    classMaterialResponse.data,
    classMaterialResponse.error,
    deleteClassMaterialResponse.data,
    deleteClassMaterialResponse.error,
  ]);
  useEffect(() => {
    createClassNoteResponse.data && (refetch(), notesFormik.resetForm());
    createClassNoteResponse.error &&
      console.log(createClassNoteResponse.error.message);
    deleteClassNoteResponse.data && refetch();
    deleteClassNoteResponse.error &&
      console.log(deleteClassNoteResponse.error.message);
  }, [
    createClassNoteResponse.data,
    classMaterialResponse.error,
    deleteClassNoteResponse.data,
    deleteClassMaterialResponse.error,
  ]);
  useEffect(() => {
    getClassNoteResponse.data &&
      (setClassNote(getClassNoteResponse.data.classNote),
      console.log(getClassNoteResponse.called));
    getClassNoteResponse.error &&
      console.log(getClassNoteResponse.error.message);
  }, [getClassNoteResponse.data, getClassNoteResponse.error]);

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      {classroom && (
        <>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography>
                  {classroom.name} - {classroom.year}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <TabContext value={tabValue}>
              <StyledTabBox>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  centered
                >
                  <Tab
                    label="Class Materials"
                    value={"1"}
                    wrapped
                    sx={{ width: { sm: "80%" } }}
                  />
                  <Tab
                    label="Class Notes"
                    value={"2"}
                    wrapped
                    sx={{ width: { sm: "80%" } }}
                  />
                </TabList>
              </StyledTabBox>
              <TabPanel
                value={"1"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  p: tabValue === "1" ? {xs: 1, sm:5} : 0,
                }}
              >
                {token.role === "teacher" && (
                  <form onSubmit={materialsFormik.handleSubmit}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 2,
                        border: "2px solid #7393B3",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <FormControl
                        sx={{
                          gridColumn: {
                            xs: "span 12",
                            sm: "span 4",
                            md: "span 6",
                          },
                        }}
                      >
                        <InputLabel htmlFor="my-input">name</InputLabel>
                        <Input
                          name="name"
                          type="text"
                          value={materialsFormik.values.name}
                          aria-describedby="my-helper-text"
                          onChange={materialsFormik.handleChange}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          gridColumn: {
                            xs: "span 12",
                            sm: "span 8",
                            md: "span 6",
                          },
                        }}
                      >
                        <InputLabel htmlFor="my-input">description</InputLabel>
                        <Input
                          name="description"
                          type="text"
                          aria-describedby="my-helper-text"
                          onChange={materialsFormik.handleChange}
                          value={materialsFormik.values.description}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          gridColumn: {
                            xs: "span 12",
                            sm: "3 / span 8",
                            md: "span 6",
                          },
                        }}
                      >
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload files
                          <VisuallyHiddenInput
                            name="file"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </FormControl>
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          gridColumn: {
                            xs: "span 12",
                            sm: "3 / span 8",
                            md: "span 6",
                          },
                        }}
                      >
                        submit
                      </Button>
                    </Box>
                  </form>
                )}
                {classroom.classMaterials &&
                  classroom.classMaterials.map((material) => (
                    <Box
                      key={material.id}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <ButtonGroup>
                        <Button
                          variant="text"
                          sx={{ justifyContent: "flex-start", width: "100%" }}
                        >
                          {material.name}
                        </Button>
                        {token.role === "teacher" && (<IconButton
                          sx={{ ml: "auto" }}
                          onClick={() =>
                            deleteClassMaterial({
                              variables: { id: material.id },
                            })
                          }
                        >
                          <DeleteForeverIcon color="error" />
                        </IconButton>)}
                      </ButtonGroup>
                      <Typography variant="body2" color={"gray"} ml={2}>
                        {material.description}
                      </Typography>
                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  ))}
              </TabPanel>
              <TabPanel
                value={"2"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  p: tabValue === "2" ? {xs: 1, sm:5} : 0,
                }}
              >
                {token.role === "teacher" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      border: "2px solid #7393B3",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <FormControl>
                      <InputLabel htmlFor="my-input">Title</InputLabel>

                      <Input
                        name="title"
                        type="text"
                        aria-describedby="my-helper-text"
                        onChange={notesFormik.handleChange}
                        value={notesFormik.values.title}
                      />
                    </FormControl>
                    <FormControl>
                      <textarea
                        name="description"
                        style={textAreaStyle}
                        placeholder="Note"
                        onChange={notesFormik.handleChange}
                        value={notesFormik.values.description}
                      ></textarea>
                    </FormControl>
                    <Button
                      onClick={notesFormik.handleSubmit}
                      variant="contained"
                    >
                      Add note
                    </Button>
                  </Box>
                )}
                {classroom.classNotes &&
                  !readStatus &&
                  classroom.classNotes.map((note) => (
                    <Box
                      key={note.id}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        sx={{ p: 1 }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ justifyContent: "flex-start", width: "100%" }}
                        >
                          {note.title}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => handleRead(note.id)}
                          color="success"
                        >
                          Read
                        </Button>
                        {token.role === "teacher" && (
                          <IconButton
                            sx={{ ml: "auto" }}
                            onClick={() =>
                              deleteClassNote({
                                variables: { id: note.id },
                              })
                            }
                          >
                            <DeleteForeverIcon color="error" />
                          </IconButton>
                        )}
                      </Box>
                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  ))}
                {readStatus && (
                  <Box>
                    {(getClassNoteResponse.loading || !classNote) ? (
                      <CircularProgress thickness={6} size={70} sx={{ mt: 5, float: 'left', left: '50%', position: 'relative' }}/>
                    ) : (
                      <Card variant="elevation" sx={{ p:1 }}>
                        <IconButton
                          onClick={() => setReadStatus(false)}
                          sx={{ float: "right" }}
                        >
                          <CloseIcon color="error" />
                        </IconButton>
                        <Typography align="center" variant="h3" textTransform="uppercase">
                          {classNote.title}
                        </Typography>
                        <Typography variant="body 2">
                          {classNote.description}
                        </Typography>
                      </Card>
                    )}
                  </Box>
                )}
              </TabPanel>
            </TabContext>
          </Grid>
          <Grid item></Grid>
        </>
      )}
    </Grid>
  );
}

export default ClassroomInfo;
