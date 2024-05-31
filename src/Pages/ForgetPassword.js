import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';
import "../components/ForgetPassword/ForgetPassword.css"
import emailjs from '@emailjs/browser';

/**
 * Kyle
 * Forget Password Page
 */
export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

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
                main: "#fc4345"
            }
        },
    });

    /**monitoring any change in email field */
    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        setError(!validateEmail(value));
    }

    /**handle change password request */
    const handleSubmit = async (event) => {
        event.preventDefault();
        let Data = {
            email: email
        }
        try {
            const res = await axios.post(`auth/forgetPassword`, Data);
            if (res.data.success) {
                var templateParams = {
                    name: res.data.name,
                    to_email: res.data.to_email,
                    temp_password: res.data.temp_password,
                    link_to: "https://yunjiaapp-c337d89ea438.herokuapp.com/",
                };

                /**
                 * If the account is created successfully, then send a email to corresponding email address
                 */
                emailjs
                .send('service_wqhgi2c', 'template_2tgjx2g', templateParams, {
                  publicKey: 'z85pphIC9JCDUUr7P',
                })
                .then(
                  () => {
                    console.log('SUCCESS!');
                  },
                  (error) => {
                    console.log('FAILED...', error.text);
                  },
                );

                document.getElementById("FP-SuccessSubmit").classList.remove("FP-hidden");
                document.getElementById("FP-FailSubmit").classList.add("FP-hidden");
            }
            else {
                document.getElementById("FP-FailSubmit").innerHTML = res.data.error;
                document.getElementById("FP-FailSubmit").classList.remove("FP-hidden");
                document.getElementById("FP-SuccessSubmit").classList.add("FP-hidden");
            }
        } catch (error) {
            console.log("error submitting request at this time", error);
        }
    };

    /**Validate the format of email address */
    const validateEmail = (email) => {
        // Regular expression for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <KeyIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forget Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={error}
                            onChange={handleEmailChange}
                        />
                        <p
                            id="FP-SuccessSubmit"
                            className='FP-hidden'>
                            *A password reset link has been sent to email
                        </p>
                        <p
                            id="FP-FailSubmit"
                            className='FP-hidden'>
                        </p>
                        <Button
                            variant="text"
                            fullWidth
                            id='return_to_login_button'
                            sx={{ ml: "auto" }}
                            onClick={()=>{
                                let path = '/'
                                navigate(path)
                            }}
                        >
                            Return to login page
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
