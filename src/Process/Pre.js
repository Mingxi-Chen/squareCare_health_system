// import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CardOverflow } from '@mui/joy';
import { Typography } from "@mui/joy";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent,DialogActions } from '@mui/material';
import { Select, MenuItem,Box,FormControl,InputLabel  } from '@mui/material';

import React, { useContext, useEffect, useState,useRef } from "react";
import BookingList from './BookingList'; // Ensure path is correct
// console.log("log bookingList componenet",BookingList);  

// Ming
import axios from 'axios';


function EditToolbar(props) {
 
}




export default function Pre({patientId}) {
  const [date, setDate] = React.useState('');
  const [roomType, setRoomType] = React.useState('');
  const [processName,setProcessName] = React.useState('');
  // const [showForm, setShowForm] = React.useState(false); // New state to toggle form visibility
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = React.useState('');
  const [selectedDoctor, setSelectedDoctor] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [doctors, setDoctors] = React.useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]); // used to fetch roomType for fropdown menu

  const PRECARE_TAG = 'precare'; // Used to send to backend set as tag

  const resetForm = () => {
    setDate('');
    setRoomType('');
    setProcessName('');
    setRooms([]);
    setSelectedRoom('');
    setSelectedDoctor('');
    setStartTime('');
    setEndTime('');
    setDoctors([]);
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/processRoute/getAllBookings', {params: {patientId: patientId}});
      const filteredBookings = response.data.filter(booking => booking.tag === PRECARE_TAG);
      setBookings(filteredBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      console.error('Detailed error:', err.response ? err.response.data : 'No server response');
    }
  };

  const handleSearchRoom = async(event)=>{
    event.preventDefault();
    try{
      const response = await axios.post('/api/processRoute/searchRooms',{  date,roomType  })
      if (response.data && response.data.rooms && response.data.notAvailableRooms) {
          const roomsWithAvailability = response.data.rooms.map(room => {
            const unavailability = response.data.notAvailableRooms
            .filter(unavailable => unavailable.room._id === room._id )
            .map(unavail => {
              if (unavail.startTime && unavail.endTime) {
                return `${unavail.startTime} - ${unavail.endTime}`;
              } else {
                console.log(`Missing start or end time for room ${room.roomNumber}`);
                return ''; // This line will only execute if start or end time is missing
              }
            })
            .filter(u => {
              // console.log(`Filtered unavailability for room ${room.roomNumber}: ${u}`);
              return u; // Keeps only non-empty strings
            })
            .join(", ");
        
        return {
          ...room,
          unavailability: unavailability
        };
      });
        setRooms(roomsWithAvailability);
        console.log(roomsWithAvailability);
    }
  }
    catch(error){
      
    }
  }
  const handleSearchDoctors = async() => {
    try{
      const response = await axios.post('/api/processRoute/searchStaffs')
      setDoctors(response.data);
    }
    catch(error){
      console.error('Failed to fetch doctors:', error);
    }
  };

  const handleSubmit = async () => {
    // Prevent the function from being executed if not all fields are filled
    if (!date || !roomType || !processName || !selectedRoom || !selectedDoctor || !startTime || !endTime) {
      alert('Please fill all fields before submitting.');
      return; // Stop the function if any field is missing
    }
  
    // Prepare the data object to send
    const dataToSend = {
      date,
      roomType,
      processName,
      selectedRoom,
      selectedDoctor,
      startTime,
      endTime,
      tag: PRECARE_TAG,  // Add the constant 'precare' as a tag
      patientId
    };
  
    try {
      // Send the POST request with axios
      const response = await axios.post('/api/processRoute/submitProcedure', dataToSend);
      // Optional: Handle response data or state updates
      alert('Procedure submitted successfully!');
      if(true){
        // Create the event after the procedure is successfully submitted
      const eventResponse = await axios.post('/api/processRoute/createEvent', {
        selectedDoctor,
        startTime,
        endTime,
        processName,
        date
      });
      console.log('Event create response:', eventResponse);
      // alert('Event created successfully!');
    }
      setDialogOpen(false);
      fetchBookings(); // Now accessible and will refresh bookings
      resetForm();  // Reset form fields after successful submission
    } catch (error) {
      // Handle errors, e.g., display an error message
      console.error('Failed to submit procedure:', error);
      alert(error.response.data.message);
    }
  };
  

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('/api/processRoute/getRoomTypes');
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Failed to fetch room types:', error);
    }
  };

  useEffect(() => {
    // console.log(patientId,1)
    fetchBookings();
    fetchRoomTypes();
  }, [patientId]); // Dependency array to ensure it runs when patientId changes




  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
    if (!dialogOpen) {
      resetForm();
    }
  };

  return (
    <CardOverflow
      sx={{
        minHeight: 300,
        width: '90%',
        margin: 'auto',
        marginTop: 4,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography level="h1" sx={{ textAlign: 'left' }}>Pre-surgery Care</Typography>   
      <Button onClick={toggleDialog} variant="contained" sx={{
          marginBottom: 2,
          width: '400px',  // Adjust width here, set to 'auto' or a specific value like '150px'
          padding: '6px 12px'  // Adjust padding to make the button physically smaller
        }}>Add Procedure</Button>
      <Dialog open={dialogOpen} onClose={toggleDialog}
      sx={{ '& .MuiDialog-paper': { minWidth: '600px', maxWidth: '80%', width: 'auto', height:'900px'} }} 
      >
      <DialogTitle sx={{ mb: 2 }}>Add a New Procedure</DialogTitle>
      <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel>TypeRoom</InputLabel>
            <Select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              label="TypeRoom"
            >
              {roomTypes.map((type) => (
                <MenuItem key={type._id} value={type.typeName}>
                  {type.typeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            fullWidth
            label="Process Name"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            sx={{ marginBottom: 4}}
          />
         
          <Button margin="dense" type="submit" variant="contained" onClick={handleSearchRoom} sx={{ marginBottom: 2 }}>Search Rooms</Button> 
 
          <Select
          label="Select a Room"
          fullWidth
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{ marginBottom: 2 }}
         >
          <MenuItem value="" sx={{ mb: 2 }}>
            <em>Click Search Rooms to acquire time availability</em>
          </MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room._id} value={room._id}>{`Room ${room.roomNumber} - ${room.filledStatus}  -Except ${room.unavailability}`}</MenuItem>
          ))}
          </Select>
          <Button
            margin="dense"
            variant="contained"
            onClick={handleSearchDoctors}
            sx={{ marginBottom: 2 }}  // Adds margin-top to space it from the Select
          >
            Search Doctors
          </Button>
          <Select
            label="Select a Doctor"
            fullWidth
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select a Doctor</em>
            </MenuItem>
            {doctors.map((doctor) => (
              <MenuItem key={doctor._id} value={doctor._id}>{`${doctor.name} - ${doctor.department}`}</MenuItem>
            ))}
          </Select>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              sx={{ width: '48%' }}  // Half the container width minus a little gap
            />
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              sx={{ width: '48%' }}  // Same as start time for alignment
            />
          </Box>
          
          </DialogContent>
          <DialogActions>
          <Button onClick={toggleDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
         </DialogActions> 
        </Dialog>
        <div>  
        <Box sx={{ margin: 2 }}> <BookingList bookings={bookings} patientId={patientId} setBookings={setBookings}/></Box>
    </div>
    </CardOverflow>
  );
}