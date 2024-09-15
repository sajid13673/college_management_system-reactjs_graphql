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
import { useEffect } from "react";

export default function TeacherTable(props) {
  const StyledHeadTableCell = props.styledHeadTableCell;
  const [deleteClass, { error, loading, data }] = useMutation(DELETE_USER);
  const deleteClassroom = (id) => {
    deleteClass({
      variables: {
        id: id,
      },
    });
    if (error) {
      console.log(error);
    }
  };
  const handleEdit = (id) => {
    props.handleEdit(id);
  };
  useEffect(() => {
    error && console.log(error.message);
    data && props.handleGetTeachers();
  }, [error, data]);
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
            <StyledHeadTableCell align="center">classrooms</StyledHeadTableCell>
            <StyledHeadTableCell align="center" colSpan={2}>
              actions
            </StyledHeadTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.teachers.map((row) => (
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
                {row.classrooms.map((classroom) => (
                  <Typography key={classroom.id}>
                    {classroom.name} - {classroom.year}
                  </Typography>
                ))}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                <Tooltip title="Edit Teacher">
                  <IconButton onClick={() => handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                <Tooltip title="Delete Teacher">
                  <IconButton
                    onClick={() => deleteClassroom(row.user.id)}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </StyledHeadTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
