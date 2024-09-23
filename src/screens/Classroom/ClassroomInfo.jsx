import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CLASS_MATERIAL } from "../../Graphql/Mutations";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { GET_CLASSROOM_BY_ID } from "../../Graphql/Queries";
import { Formik, useFormik } from "formik";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuth } from "../../utils/authProvider";

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
const StyledTab = styled(Tab)({
  width: "100%",
})
function ClassroomInfo() {
  const {token} = useAuth()
  console.log(token);
  const { id } = useParams();
  const { data, error, loading, refetch } = useQuery(GET_CLASSROOM_BY_ID, {
    variables: { id: id },
  });
  const [classroom, setClassroom] = useState();
  const formik = useFormik({
    initialValues: {
      classroom_id: id,
      name: "",
      description: "",
      file: null,
    },
    // validate: validate,
    onSubmit: (values) => {
      createClassMaterial({ variables: values });
    },
  });
  const [tabValue, setTabValue] = useState("1");
  const [createClassMaterial, classMaterialResponse] = useMutation(
    CREATE_CLASS_MATERIAL
  );
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue(event.target.name, file);
  };
  useEffect(() => {
    data && setClassroom(data.classroom);
    data && console.log(data.classroom);
  }, [data, error]);

  useEffect(()=>{
    classMaterialResponse.data && (refetch());
    classMaterialResponse.error && console.log(classMaterialResponse.error.message);
  },[classMaterialResponse.data, classMaterialResponse.error])

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
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "#a7d0f9",
                  borderRadius: 1,
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  centered
                >
                  <Tab label="Class Materials" value={"1"} wrapped sx={{ width: {sm:'80%'}  }}/>
                  <Tab label="Class Notes" value={"2"} wrapped sx={{ width: {sm:'80%'} }}/>
                </TabList>
              </Box>
              <TabPanel value={"1"} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                {token.role === 'teacher' && (<form onSubmit={formik.handleSubmit}>
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
                        value={formik.values.name}
                        aria-describedby="my-helper-text"
                        onChange={formik.handleChange}
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
                        onChange={formik.handleChange}
                        value={formik.values.description}
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
                </form>)}
                {classroom.classMaterials && classroom.classMaterials.map((material)=>(
                  <Box key={material.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button variant="text" sx={{ justifyContent: 'flex-start', width: '100%' }}>{material.name}</Button>
                    <Typography variant="body2" color={'gray'} ml={2}>{material.description}</Typography>
                    <Divider sx={{mt: 1.5}}/>
                  </Box>
                ))}
              </TabPanel>
              <TabPanel value={"2"}>
                <Typography>notes</Typography>
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
