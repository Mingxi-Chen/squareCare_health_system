import React, { useState } from "react";
import {
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Staffs = () => {
  function createData(name, id, dob, role, status) {
    return { name, id, dob, role, status };
  }

  const rows = [
    createData("Liam Walsh", "159", "1/1/1991", "Doctor", "On Duty"),
    createData("Sara Knight", "237", "2/2/1992", "Nurse", "Off Duty"),
    createData("Alex Reed", "262", "3/3/1993", "Hospital Admin", "On Duty"),
    createData("Jasper Reid", "305", "4/4/1994", "System Admin", "Off Duty"),
    createData("Emily Clarke", "356", "5/5/1995", "Doctor", "On Call"),
    createData("Declan Frost", "356", "6/6/1996", "Technician", "Unavailable"),
  ];
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // Define the state for the current page and rows per page
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Page index is 0-based
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to zero on rows per page change
  };

  // Function to return style based on the patient's status
  const getStatusStyle = (status) => {
    // Common styles for all status labels
    const commonStyles = {
      display: "block",
      margin: "auto",
      width: "100px", // Fixed width for all labels
      height: "25px", // Fixed height for all labels
      color: "black",
      borderRadius: "15px",
      fontSize: "0.8 rem", // Adjust font size as needed
      textAlign: "center",
      lineHeight: "25px",
    };
    switch (status) {
      case "Unavailable":
        return {
          backgroundColor: "#A4ABB6",
          ...commonStyles,
        };
      case "On Duty":
        return {
          backgroundColor: "#ACECD5",
          ...commonStyles,
        };
      case "On Call":
        return {
          backgroundColor: "#FAD5A5",
          ...commonStyles,
        };
      case "Off Duty":
        return {
          backgroundColor: "#C4C9D1",
          ...commonStyles,
        };
      default:
        return {
          backgroundColor: "gray",
          ...commonStyles,
        };
    }
  };

  return (
    <div className="account-wrapper">
      {/** Display "Patients" on top left */}
      <Typography variant="h5" sx={{ marginBottom: 5 }}>
        Staff Management
      </Typography>

      {/** Search Field */}
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search..."
        value={searchQuery}
        variant="outlined"
        className="accounts-search"
        sx={{ my: 1, width: "100%" }}
        size="small"
        onChange={handleSearchChange}
        onBlur={() => setSearchQuery("")}
      />
      {/* Table of accounts */}
      <TableContainer
        className="account-table-container"
        sx={{ borderRadius: 3, boxShadow: 3 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F7F7F7", boxShadow: 1 }}>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">DOB</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>

          {/** For UI showing */}
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{row.dob}</TableCell>
                  <TableCell align="center">{row.role}</TableCell>
                  <TableCell align="center">
                    <label style={getStatusStyle(row.status)}>
                      {row.status}
                    </label>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TablePagination component */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]} // Allow users to choose 5, 10, or 15 rows per page
      />
    </div>
  );
};

export default Staffs;
