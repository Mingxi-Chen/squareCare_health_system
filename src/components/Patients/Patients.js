import React, { useEffect, useState } from "react";
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CreatePatient from "./createPatient";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  useEffect(() => {
    axios
      .get(`/patientsManager`)
      .then((response) => {
        if (response.data && response.data.success) {
          setAllAccounts(response.data.patients);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("API call failed:", err);
      });
  }, []);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [allAccounts, setAllAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [createPatientOpen, setCreatePatientOpen] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const handleCreatePatient = () => {
    setCreatePatientOpen(true);
  };

  const handleCreatePatientClose = () => {
    setCreatePatientOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Page index is 0-based
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to return style based on the patient's status
  const getStatusStyle = (status) => {
    const commonStyles = {
      display: "block",
      margin: "auto",
      width: "100px",
      height: "25px",
      color: "black",
      borderRadius: "15px",
      fontSize: "0.8rem",
      textAlign: "center",
      lineHeight: "25px",
    };
    switch (status) {
      case "Emergency":
        return {
          backgroundColor: "#FFB9B3",
          ...commonStyles,
        };
      case "Discharged":
        return {
          backgroundColor: "#ACECD5",
          ...commonStyles,
        };
      case "In-Patient":
        return {
          backgroundColor: "#FFD5B8",
          ...commonStyles,
        };
      case "Out-Patient":
        return {
          backgroundColor: "#FFF9AA",
          ...commonStyles,
        };
      default:
        return {
          backgroundColor: "bisque",
          ...commonStyles,
        };
    }
  };

  // Onclick function to render pageinfo page
  const handlePatientClick = (patientId, isActionColumn) => {
    if (!isActionColumn) {
      navigate(`/patientInfo/${patientId}`);
    }
  };

  const fetchAllPatients = () => {
    axios
      .get(`/patientsManager`)
      .then((response) => {
        if (response.data && response.data.success) {
          setAllAccounts(response.data.patients);
        } else {
          console.error("Failed to fetch data:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("API call failed:", err);
      });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/patientsManager/${selectedAccount._id}`);
      fetchAllPatients();
      setSnackbarMessage("Patient deleted successfully.");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error deleting account", error);
      setSnackbarMessage("Failed to delete patient.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    setOpenDialog(false);
    setSelectedAccount(null);
  };

  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="account-wrapper">
      <Typography variant="h5">Patients</Typography>

      <div className="new-btn-div">
        <Button
          className="new-btn"
          onClick={handleCreatePatient}
          sx={{
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            backgroundColor: "#5932EA",
            color: "white",
            "&:hover": {
              backgroundColor: "#4c2bd9",
            },
            "&:active": {
              backgroundColor: "#3f24b8",
            },
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          New Patient
        </Button>
      </div>

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
        id="search"
        value={searchQuery}
        variant="outlined"
        className="accounts-search"
        sx={{
          my: 1,
          width: "100%",
          border: isSearchFocused ? "1px solid #5932EA" : "",
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#5932EA",
              borderRadius: "2px",
            },
          },
        }}
        size="small"
        onChange={handleSearchChange}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => {
          setIsSearchFocused(false);
          setSearchQuery("");
        }}
      />
      {/* Table of accounts */}
      <TableContainer
        className="account-table-container"
        sx={{ borderRadius: 3, boxShadow: 3, minHeight: "56vh" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F7F7F7", boxShadow: 1 }}>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Blood Group</TableCell>
              <TableCell align="center">Blood Pressure</TableCell>
              <TableCell align="center">Assigned Doctor</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/** For UI showing */}
          <TableBody>
            {allAccounts
              .filter(
                (account) =>
                  (account.firstName + " " + account.lastName)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  account.gender
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  account.assignedDoctor
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  account.status
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((account) => (
                <TableRow
                  key={account._id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover .action-cell": {
                      backgroundColor: "transparent",
                    },
                  }}
                  onClick={() => handlePatientClick(account._id, false)}
                >
                  <TableCell align="center">
                    {account.firstName + " " + account.lastName}
                  </TableCell>
                  <TableCell align="center">{account.gender}</TableCell>
                  <TableCell align="center">{account.bloodGroup}</TableCell>
                  <TableCell align="center">{account.bloodPressure}</TableCell>
                  <TableCell align="center">{account.assignedDoctor}</TableCell>
                  <TableCell align="center">
                    <label style={getStatusStyle(account.status)}>
                      {account.status}
                    </label>
                  </TableCell>
                  <TableCell
                    className="action-cell"
                    onClick={(e) => e.stopPropagation()}
                    align="center"
                  >
                    <Button
                      onClick={() => handleDeleteClick(account)}
                      variant="Text"
                      color="error"
                      sx={{
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.75rem",
                        color: "red",
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TablePagination component */}
      <TablePagination
        component="div"
        id="table-pagination"
        count={allAccounts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
      <CreatePatient
        onClose={handleCreatePatientClose}
        setAllAccounts={setAllAccounts}
        open={createPatientOpen}
      />
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this patient?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Patients;
