import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "@apollo/client";
import { DELETE_CLASSROOM } from "../../Graphql/Mutations";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
// const StyledHeadTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//     textTransform: "uppercase",
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledHeadTableCell = withStyles({
//   root: {
//     textTransform: "uppercase",
//   }
// })(TableCell);
export default function ClassroomTable(props) {
  const [deleteClass, { error }] = useMutation(DELETE_CLASSROOM);
  const StyledHeadTableCell = props.styledHeadTableCell;

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
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          {/* sx={{ background: "#0d47a1", textTransform: "uppercase"}} */}
          <TableRow>
            <StyledHeadTableCell align="center">name</StyledHeadTableCell>
            <StyledHeadTableCell align="center">year</StyledHeadTableCell>
            <StyledHeadTableCell align="center" colSpan={2}>
              actions
            </StyledHeadTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.classrooms.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledHeadTableCell component="th" scope="row" align="center">
                {row.name}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                {row.year}
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                <Tooltip title="Edit Classroom">
                  <IconButton onClick={() => handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </StyledHeadTableCell>
              <StyledHeadTableCell align="center">
                <Tooltip title="Delete Classroom">
                  <IconButton
                    onClick={() => deleteClassroom(row.id)}
                    variant="contained"
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
