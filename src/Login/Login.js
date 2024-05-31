import * as React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LS_AUTH_KEY } from "../context/config";
import { UserContext } from "../context/context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(`/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem(LS_AUTH_KEY, data.token);
        setUser(data.user);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        navigate("/dashboard");
      } else {
        console.log("from else " + data.error);
        setError(data.error);
        return;
      }
    } catch (error) {
      setError(error.response?.data?.error);
    }

    setEmail("");
    setPassword("");
  };

  const navigateForgetPassword = () => {
    navigate("/forgetpassword");
  };

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

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              id="remember_me_checkbox"
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              variant="text"
              id="forget_password_button"
              sx={{ ml: "auto" }}
              onClick={navigateForgetPassword}
            >
              Forgot Password?
            </Button>
            <Button
              id="submit_button"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
