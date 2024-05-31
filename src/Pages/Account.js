import React, { useState, useEffect } from "react";
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Modal,
  Typography,
  TextField,
  IconButton,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Sidebar from "../components/SideBar";
import "../components/Account/Account.css";
import { Snackbar, Alert } from "@mui/material";

import emailjs from "@emailjs/browser";

const AccountManagement = () => {
  const [open, setOpen] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [deleteAccount, setDeleteAccount] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [EnsureDte, setEnsureDte] = React.useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({
      ...notification,
      open: false,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const openCreateAccountWindow = () => {
    setShowCreateAccount(true);
  };

  const closeCreateAccountWindow = () => {
    setShowCreateAccount(false);
  };

  const handlePasswordRecovWindow = (account) => {
    setShowPasswordRecovery(true);
    setActiveAccount(account);
  };

  const closePasswordRecovery = () => {
    setShowPasswordRecovery(false);
    setActiveAccount(null);
    const confirmPWText = document
      .getElementById("ComfirmpPassword")
      .classList.add("hiden");
  };

  /**
   * Junlin
   * Request to delete a account on the server
   */
  async function handleDelete(event) {
    event.preventDefault();
    try {
      let Data = deleteAccount;
      const response = await axios.post(`/auth/deleteAccount`, {
        email: Data,
      });
      if (response.data.success) {
        const result = await axios.get(`/auth/allAccount`);

        setAccounts(result.data);
      }
    } catch (error) {
      console.error("Error delecting account", error);
    }
    setEnsureDte(false);
  }

  /**
   * Junnlin
   * Render every time there is change in list of all account
   */
  useEffect(() => {
    async function startFetching() {
      try {
        const result = await axios.get(`/auth/allAccount`);
        setAccounts(result.data);
      } catch (error) {
        console.error("Error fetching event from server", error);
      }
    }
    startFetching();
  }, []);

  // Used for button color
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText("#5932EA"),
    backgroundColor: "#5932EA",
    "&:hover": {
      backgroundColor: "#5932EA",
    },
  }));

  /*color palette*/
  const theme = createTheme({
    palette: {
      primary: {
        main: "#5932EA",
      },
      secondary: {
        main: "#000000",
      },
      third: {
        main: "#fc4345",
      },
    },
  });

  // used for Create Account Window
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none", // Removes the default focus outline
  };

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SearchBar = ({ searchTerm, handleSearch }) => (
    <ThemeProvider theme={theme}>
      <TextField
        type="text"
        placeholder="Search..."
        variant="outlined"
        size="small"
        fullWidth
        id="search"
        value={searchTerm}
        onChange={handleSearch}
        inputRef={(input) => input && input.focus()}
      />
    </ThemeProvider>
  );

  /**
   * Junlin
   * Handle Creating new account
   */
  const CreateAccountWindow = ({ closeWindow, showCreateAccount }) => {
    const [newAccount, setnewAccount] = useState({
      email: "",
      name: "",
      role: "Doctor",
      department: "",
      address: "",
      gender: "male",
      password: "",
      phonenum: "",
    });

    const [createAccountErrorMes, setcreateAccountErrorMes] = useState("");
    const [error, setError] = useState(false);
    /**
     * monitoring the change in new account form
     */
    const handleNewAccountFormchange = (e) => {
      const { name, value } = e.target;

      if (name == "email") {
        setError(!validateEmail(value));
      }
      setnewAccount((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    // Function to handle phone number input change
    const handlePhoneChange = (e) => {
      const { name, value } = e.target;

      if (name === "phonenum") {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, "");

        // Slice the digits into parts and join with dashes
        const formattedNumber = digits
          .slice(0, 10) // Ensure we only use the first 10 digits
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
          .trim();

        // Update the state with the formatted number
        setnewAccount({ ...newAccount, [name]: formattedNumber });
      } else {
        // Handle changes for other inputs normally
        setnewAccount({ ...newAccount, [name]: value });
      }
    };

    /**Validate the format of email address */
    const validateEmail = (email) => {
      // Regular expression for email validation
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    /**submit new account info to the server*/
    const handleNewAccountSubmit = async (event) => {
      event.preventDefault();
      if (validateEmail(newAccount.email)) {
        let Data = {
          email: newAccount.email,
          name: newAccount.name,
          role: newAccount.role,
          department: newAccount.department,
          address: newAccount.address,
          gender: newAccount.gender,
          password: newAccount.password,
          phonenum: newAccount.phonenum,
        };
        try {
          const response = await axios.post(`/auth/newAccount`, {
            data: Data,
          });

          /**request the update version of account list */
          if (response.data.success) {
            const result = await axios.get(`/auth/allAccount`);
            setAccounts(result.data);

            var templateParams = {
              name: newAccount.name,
              to_email: newAccount.email,
              temp_password: newAccount.password,
              link_to_website: "https://yunjiaapp-c337d89ea438.herokuapp.com/",
            };

            /**
             * If the account is created successfully, then send a email to corresponding email address
             */
            emailjs
              .send("service_wqhgi2c", "template_2tgjx2g", templateParams, {
                publicKey: "z85pphIC9JCDUUr7P",
              })
              .then(
                () => {
                  console.log("SUCCESS!");
                },
                (error) => {
                  console.log("FAILED...", error.text);
                }
              );
            closeWindow();
          } else {
            setcreateAccountErrorMes(response.data.error);
            document
              .getElementById("createAccountErrorMes")
              .classList.remove("hiden");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Modal
          open={true} // Controlled by your state
          onClose={closeWindow}
          aria-labelledby="create-account-modal-title"
          aria-describedby="create-account-form-description"
        >
          <Box sx={style}>
            <IconButton
              aria-label="close"
              onClick={closeWindow}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="create-account-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Create Account
            </Typography>
            <Box
              component="form"
              autoComplete="off"
              onSubmit={handleNewAccountSubmit}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <TextField
                name="email"
                required
                label="email"
                placeholder="email"
                error={error}
                fullWidth
                onChange={handleNewAccountFormchange}
              />
              <TextField
                name="name"
                required
                label="Name"
                placeholder="Enter your full name"
                fullWidth
                onChange={handleNewAccountFormchange}
              />
              <TextField
                name="role"
                required
                label="Role"
                placeholder="Role"
                select
                SelectProps={{ native: true }}
                fullWidth
                onChange={handleNewAccountFormchange}
              >
                <option value="Doctor">Doctor</option>
                <option value="Hospital Admin">Hospital Admin</option>
                <option value="Nurse">Nurse</option>
                <option value="System Admin">System Admin</option>
                <option value="Technician">Technician</option>
              </TextField>
              <TextField
                name="department"
                required
                label="Department"
                placeholder="Enter your department"
                fullWidth
                onChange={handleNewAccountFormchange}
              />
              <TextField
                name="address"
                required
                label="Address"
                placeholder="Address"
                fullWidth
                onChange={handleNewAccountFormchange}
              />
              <TextField
                name="gender"
                select
                label="Gender"
                fullWidth
                SelectProps={{ native: true }}
                onChange={handleNewAccountFormchange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </TextField>
              <TextField
                name="password"
                required
                label="Password"
                placeholder="Password"
                type="password"
                inputProps={{ minLength: 8 }}
                fullWidth
                onChange={handleNewAccountFormchange}
              />
              <TextField
                name="phonenum"
                required
                label="Contact Info"
                placeholder="Enter Phone Number"
                type="tel"
                inputProps={{ pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}" }}
                value={newAccount.phonenum}
                fullWidth
                onChange={handlePhoneChange}
              />
              <p
                id="createAccountErrorMes"
                className="hiden"
                style={{ color: "#fc4345" }}
              >
                *{createAccountErrorMes}
              </p>
              <Box gridColumn="span 2" sx={{ colors: "#5932EA" }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Add Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </ThemeProvider>
    );
  };

  /**
   * Junlin
   * Handle password recovery field change and submit
   */
  const PasswordRecoveryWindow = ({ closeWindow, account }) => {
    const [passwordField, setpasswordField] = useState({
      email: activeAccount,
      //adminPW: "",
      newPW: "",
      confirmnewPW: "",
    });

    /**monitoring every time there is change in textfield */
    const handleFWChange = (e) => {
      const { name, value } = e.target;
      setpasswordField((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    /**submit the password recovery to the server */
    const handlePasswordRecovery = async (event) => {
      event.preventDefault();

      const Data = {
        email: passwordField.email.email,
        newPW: passwordField.newPW,
        confirmnewPW: passwordField.confirmnewPW,
        //adminPW: passwordField.adminPW,
      };
      try {
        if (Data.newPW === Data.confirmnewPW) {
          const res = await axios.post(`/auth/passwordRecovery`, {
            data: Data,
          });

          if (res.data.success) {
            const result = await axios.get(`/auth/allAccount`);
            setAccounts(result.data);
            closeWindow();
            handleNotification("Password changed successfully!", "success");
          } else {
            handleNotification(res.data.error, "error");
          }
        } else {
          document.getElementById("ComfirmpPassword").classList.remove("hiden");
          handleNotification("Passwords do not match", "error");
        }
      } catch (error) {
        console.error("Error recovering password", error);
        handleNotification("Error recovering password", "error");
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Modal
          open={true} // This should be controlled by a state like showPasswordRecovery
          onClose={closeWindow}
          aria-labelledby="password-recovery-modal-title"
          aria-describedby="password-recovery-form-description"
        >
          <Box sx={style}>
            <IconButton
              aria-label="close"
              onClick={closeWindow}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              id="password-recovery-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Password Recovery
            </Typography>
            <Box
              component="form"
              autoComplete="off"
              onSubmit={handlePasswordRecovery}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
                alignItems: "center",
              }}
            >
              {/*               <TextField
                name="adminPW"
                label="System admin's password"
                placeholder="System admin's password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                onChange={handleFWChange}
              />
 */}
              <TextField
                name="newPW"
                label="New Password"
                placeholder="New Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                onChange={handleFWChange}
              />
              <TextField
                name="confirmnewPW"
                label="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                required
                onChange={handleFWChange}
              />
              <p
                id="ComfirmpPassword"
                className="hiden"
                style={{ color: "#fc4345" }}
              >
                *New Password and Comfirm field does not match.
              </p>
              <Box sx={{ mt: 2, width: "100%" }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </ThemeProvider>
    );
  };

  return (
    <main style={{ display: "flex", overflow: "hidden" }}>
      <div
        style={{
          width: open ? 240 : 100,
          transition: "width 0.3s ease-in-out",
          backgroundColor: "#FAFBFF",
        }}
        className="drawer-wrapper"
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>
      <div style={{ flexGrow: 1, minWidth: "300px" }}>
        <Box style={{ padding: "20px" }}>
          <h1>Account Management</h1>
          <Box mb={2}>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          </Box>
          <Box mb={2}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="Account table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.email}>
                      <TableCell component="th" scope="account">
                        {account.id}
                      </TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.address}</TableCell>
                      <TableCell>{account.department}</TableCell>
                      <TableCell>{account.role}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <ThemeProvider theme={theme}>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {" "}
                            {/* Add gap for spacing between buttons */}
                            <React.Fragment>
                              <Button
                                variant="outlined"
                                color="third"
                                onClick={() => {
                                  setEnsureDte(true);
                                  setDeleteAccount(account.email);
                                }}
                              >
                                Delete
                              </Button>
                              <Dialog
                                open={EnsureDte}
                                keepMounted
                                onClose={() => {
                                  setEnsureDte(false);
                                }}
                                aria-describedby="alert-dialog-slide-description"
                                style={{
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                }}
                              >
                                <DialogTitle>{"Delete?"}</DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-slide-description">
                                    Deleting account will delete all the data
                                    accoicated with including their own patient,
                                    personal information, schedule!
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() => {
                                      setEnsureDte(false);
                                      setDeleteAccount();
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit" onClick={handleDelete}>
                                    Delete
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handlePasswordRecovWindow(account)}
                            >
                              Change Password
                            </Button>
                          </Box>
                        </TableCell>
                      </ThemeProvider>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <div>Total Staff: {filteredAccounts.length}</div>

          <Box display="flex" justifyContent="flex-end">
            <ColorButton variant="contained" onClick={openCreateAccountWindow}>
              Create Account
            </ColorButton>
          </Box>
          {showCreateAccount && (
            <CreateAccountWindow
              closeWindow={closeCreateAccountWindow}
              showCreateAccount={openCreateAccountWindow}
            />
          )}
          {showPasswordRecovery && activeAccount && (
            <PasswordRecoveryWindow
              closeWindow={closePasswordRecovery}
              account={activeAccount}
            />
          )}
        </Box>
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default AccountManagement;
