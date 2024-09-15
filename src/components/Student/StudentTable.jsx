import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../Graphql/Mutations";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../../utils/authProvider";
import { useEffect } from "react";

export default function StudentTable({
  students,
  styledHeadTableCell,
  handleEdit,
  handleGetStudents
}) {
  const StyledHeadTableCell = styledHeadTableCell;
  const [deleteStudent, {error, loading, data}] = useMutation(DELETE_USER);
  const {token} = useAuth();
  const deleteStudentroom = (id) => {
    deleteStudent({
      variables: {
        id: id,
      },
    });
    if (error) {
      console.log(error);
    }
  };
  const handleEditStudent = (id) => {
    handleEdit(id);
  };
  useEffect(()=>{
    error && console.log(error.message);
    data && handleGetStudents();
  },[data, error])
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledHeadTableCell align="center">name</StyledHeadTableCell>
            <StyledHeadTableCell align="center">email</StyledHeadTableCell>
            <StyledHeadTableCell align="center">
              phone number
            </StyledHeadTableCell>
            <StyledHeadTableCell align="center">address</StyledHeadTableCell>
            <StyledHeadTableCell align="center">
              Date of birth
            </StyledHeadTableCell>
            <StyledHeadTableCell align="center">classrooms</StyledHeadTableCell>
            {token.role == 'admin'&& <StyledHeadTableCell align="center" colSpan={2}>
              actions
            </StyledHeadTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledHeadTableCell component="th" scope="row" align="center">
                {row.name}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.user.email}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.phone_number}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.address}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.date_of_birth}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.classrooms.map((classroom) => (
                  <Typography key={classroom.id}>
                    {classroom.name} - {classroom.year}
                  </Typography>
                ))}
              </StyledHeadTableCell>
              {token.role == 'admin' &&
               <>
               <StyledHeadTableCell align="center">
                <Tooltip title="Edit Student">
                  <IconButton onClick={() => handleEditStudent(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                <Tooltip title="Delete Student">
                  <IconButton
                    onClick={() => deleteStudentroom(row.user.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </StyledHeadTableCell>
              </>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
