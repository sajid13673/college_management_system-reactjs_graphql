import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Login from "./screens/Login/Login";
import ClassroomList from "./screens/Classroom/ClassroomList";
import { Routes, Route } from "react-router-dom";
import TeacherList from "./screens/Teacher/TeacherList";
import { createTheme, Paper, ThemeProvider, Typography } from "@mui/material";
import StudentList from "./screens/Student/StudentList";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { ProtectedRoute } from "./utils/protectedRoute";
import { useAuth } from "./utils/authProvider";
import { GET_USER } from "./Graphql/Queries";
import ClassroomInfo from "./screens/Classroom/ClassroomInfo";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
// import WebClassList from "./components/Classroom/UserClassroomList";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const createClient = (link) => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link,
  });
};

function App() {
  const { token } = useAuth();
  const link = from([
    errorLink,
    new createUploadLink({
      uri: "http://127.0.0.1:8000/graphql",
      headers: {
        Authorization: token ? `Bearer ${token.token}` : "",
      },
    }),
  ]);
  const [client, setClient] = useState(createClient(link));
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState()
  const getUser = async () => {
    if(client){
      const res = await client.query({
        query: GET_USER
      })
      res.data && (console.log(res.data.profile),setUser(res.data.profile))
    }
  }
  const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: darkMode ? "#325168" : "#00599C",
      color: theme.palette.common.white,
      textTransform: "uppercase",
      fontFamily: "Poppins",
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: darkMode ? '#FFFFFF29' : '#eef7ff',
      fontFamily: "Poppins",
      fontSize: 14,
    },
  }));
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography:{
      h4: {
        color: "#7393B3"
      }
    },
  });

  const validateEmail = (str) => {
    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(str)
  }
  const ErrorMessage = styled(Typography)({
    color: 'red',
    fontSize: 'small',
    fontStyle: 'italic'
  })
  const modalBoxstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: {xs: "100^%", md:450},
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };
  useEffect(() => {
    setClient(createClient(link));
  }, [token]);
  useEffect(()=>{
    getUser()
  },[client])
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Paper sx={{ minHeight: "100vh" }}>
          <Routes>
            <Route path="login" element={<Login
              validateEmail = {(str) => validateEmail(str)} />}
              ErrorMessage = {ErrorMessage}
            />

            {/* protecteed routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <Header
                    darkMode={darkMode}
                    setDarkMode={(bool) => setDarkMode(bool)}
                  />
                }
              />
              <Route
                path="classroom"
                element={
                  <>
                    <Header
                      darkMode={darkMode}
                      setDarkMode={(bool) => setDarkMode(bool)}
                    />
                    <ClassroomList 
                      StyledHeadTableCell={StyledHeadTableCell}
                      ErrorMessage = {ErrorMessage} 
                      modalBoxstyle = {modalBoxstyle}
                      user = {user}
                      />
                  </>
                }
              />
              <Route
                path="classroom/:id"
                element={
                  <>
                    <Header
                      darkMode={darkMode}
                      setDarkMode={(bool) => setDarkMode(bool)}
                    />
                    <ClassroomInfo/>
                  </>
                }
              />
            </Route>
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route
                path="teacher"
                element={
                  <>
                    <Header
                      darkMode={darkMode}
                      setDarkMode={(bool) => setDarkMode(bool)}
                    />
                    <TeacherList 
                      styledHeadTableCell={StyledHeadTableCell}
                      ErrorMessage = {ErrorMessage} 
                      validateEmail = {(str) => validateEmail(str)}
                      modalBoxstyle = {modalBoxstyle}
                    />
                  </>
                }
              />
            </Route>
            <Route element={<ProtectedRoute roles={["teacher", "admin"]} />}>
              <Route
                path="student"
                element={
                  <>
                    <Header
                      darkMode={darkMode}
                      setDarkMode={(bool) => setDarkMode(bool)}
                    />
                    <StudentList 
                      styledHeadTableCell={StyledHeadTableCell}
                      validateEmail = {(str) => validateEmail(str)}
                      ErrorMessage = {ErrorMessage} 
                      modalBoxstyle = {modalBoxstyle}
                    />
                  </>
                }
              />
            </Route>
          </Routes>
        </Paper>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
