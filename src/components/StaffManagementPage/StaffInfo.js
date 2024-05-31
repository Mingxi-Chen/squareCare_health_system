/*Junlin Lei */

/*MUI*/
import { Avatar, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import { UserContext } from '../../context/context';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';


import React from 'react';

function StaffInfo() {
    const [open, setOpen] = React.useState(false);
    const [department, setDepartment] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setID] = useState('');
    const [InfoChange, setInfoChange] = useState({
        name: "",
        department: "",
        address: "",
        gender: "male",
    });
    const { user, loading } = useContext(UserContext)
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClikClose = () => {
        setOpen(false);
    }

    /*color palette*/
    const theme = createTheme({
        palette: {
            primary: {
                main: '#5932EA',
            }
        },
    });

    useEffect(() => {
        async function startFetching() {
            try {
                if (!loading) {
                    const response = await axios.get(`/users/allInfo/${user.id}`);
                    setDepartment(response.data.data.department)
                    setGender(response.data.data.gender)
                    setAddress(response.data.data.address)
                    setPhone(response.data.data.phone)
                    setName(response.data.data.name)
                    setEmail(response.data.data.email)
                    setID(response.data.data.id)
                }
            } catch (error) {
                console.error(error);
            }
        }
        startFetching();
    }, [loading]);

    async function fetchInfo() {
        try {
            if (!loading) {
                const response = await axios.get(`/users/allInfo/${user.id}`);
                setDepartment(response.data.data.department)
                setGender(response.data.data.gender)
                setAddress(response.data.data.address)
                setPhone(response.data.data.phone)
                setName(response.data.data.name)
                setEmail(response.data.data.email)
                setID(response.data.data.id)
            }
        } catch (error) {
            console.error("Error fetching event from server", error);
        }
    }

    const handleFormchange = (e) => {
        const { name, value } = e.target;
        setInfoChange((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const PersonalInfoSave = async () => {
        const data = {
            department: InfoChange.department,
            gender: InfoChange.gender,
            address: InfoChange.address,
            name: InfoChange.name
        }
        console.log(data)
        await axios.post(`/users/changeInfo/${user.id}`, data)
        fetchInfo()
    }

    // Function to generate color for avatar
    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";

        for (i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }
    // Function to generate avatar from user name
    function stringAvatar(name) {
        name = name.toUpperCase();
        return {
            sx: {
                bgcolor: stringToColor(name),
                fontSize: "1.5rem",
            },
            children: `${name.split(" ")[0][0]}`,
        };
    }
    return (
        <>
            <div className="StaffInfo col-9 col-s-11 ">
                <div className="StaffInfo-AvatarContainer">
                    <Avatar  {...stringAvatar(name)} />
                    <div className="halfspace">
                        <h1>{name}</h1>
                        <p className="StaffInfo-AvatarContainer-DepartmentText">{department}</p>
                    </div>
                </div>
                <div className="StaffInfo-InfoContainer">
                    <pre className="StaffInfo-InfoText">
                        ID: {id + "\n"}
                        Email:  {email + "\n"}
                        Gender: {gender + "\n"}
                        Address: {address + "\n"}
                        Phone: {phone + "\n"}
                    </pre>
                </div>
                <div className="StaffInfo-ButtonContainer">
                    <div className="StaffInfo-ButtonContainer-Btn">
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" color="primary" endIcon={<BorderColorIcon />} onClick={handleClickOpen}>
                                Edit
                            </Button>
                            <React.Fragment>
                                <Dialog
                                    open={open}
                                    onClose={handleClikClose}
                                    PaperProps={{
                                        component: 'form',
                                        onSubmit: (event) => {
                                            event.preventDefault();
                                            PersonalInfoSave();
                                            handleClikClose();
                                        },
                                    }}
                                >
                                    <DialogTitle>Personal Information</DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleClikClose}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="name"
                                            name="name"
                                            label="Name"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleFormchange}
                                        />
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="department"
                                            name="department"
                                            label="Department"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleFormchange}
                                        />
                                        <TextField
                                            name="gender"
                                            id="gender"
                                            required
                                            select
                                            margin="dense"
                                            label="Gender"
                                            variant="standard"
                                            fullWidth
                                            SelectProps={{ native: true }}
                                            onChange={handleFormchange}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </TextField>
                                        <TextField
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="address"
                                            name="address"
                                            label="Address"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleFormchange}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button type="submit" variant='contained' >Save</Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                        </ThemeProvider>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffInfo;