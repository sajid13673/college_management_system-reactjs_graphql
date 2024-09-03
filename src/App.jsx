import { useState } from "react";
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
import Login from "./components/login";
import ClassroomList from "./components/Classroom/ClassroomList";
import { Routes, Route } from "react-router-dom";
import TeacherList from "./components/Teacher/TeacherList";
import { createTheme, Paper, ThemeProvider } from "@mui/material";
import StudentList from "./components/Student/StudentList";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { ProtectedRoute } from "./utils/protectedRoute";

const errorLink = onError(({ graphqlErrors, networkError }) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: "http://127.0.0.1:8000/graphql" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: darkMode ? "#325168" : "#00599C",
      color: theme.palette.common.white,
      textTransform: "uppercase",
      fontFamily: "Poppins",
    },
    [`&.${tableCellClasses.body}`]: {
      fontFamily: "Poppins",
      fontSize: 14,
    },
  }));
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Paper sx={{ minHeight: "100vh" }}>
          <Routes>
            <Route path="login" element={<Login />} />

            {/* protecteed routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Header />} />
              <Route
                path="class"
                element={
                  <>
                    <Header
                      darkMode={darkMode}
                      setDarkMode={(bool) => setDarkMode(bool)}
                    />
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
                    <TeacherList styledHeadTableCell={StyledHeadTableCell} />
                  </>
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
                    <ClassroomList styledHeadTableCell={StyledHeadTableCell} />
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
                    <StudentList styledHeadTableCell={StyledHeadTableCell} />
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
