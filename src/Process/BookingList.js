import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';

export const BookingList = ({ bookings, patientId, setBookings}) => {


    const filteredBookings = bookings.filter(booking => booking.patientId && booking.patientId._id === patientId);
    const deleteBooking = async (bookingId) => {
      // Only prompt confirmation within this function
      const userConfirmed = window.confirm("Are you sure you want to delete this booking?");
      
      if (userConfirmed) {
          try {
              // Log the booking ID for debugging
              console.log("deleteBooking bookingId:", bookingId);
              
              // Make the request to delete the booking
              const response = await axios.delete(`/api/processRoute/deleteBooking/${bookingId}`);
              
              // Check if the response status is 200 (OK) to confirm the deletion succeeded
              if (response.status === 200) {
                  // Update the bookings state to remove the deleted booking
                  setBookings(currentBookings => currentBookings.filter(booking => booking._id !== bookingId));
                  console.log(`Booking with ID ${bookingId} deleted successfully.`);
              } else {
                  console.error('Unexpected response status:', response.status);
                  alert('Failed to delete the booking. Please try again.');
              }
          } catch (error) {
              console.error('Failed to delete booking:', error);
              alert('An error occurred while deleting the booking. Please try again.');
          }
      } else {
          // Handle when the user cancels the deletion
          console.log("User canceled the deletion.");
      }
  };
  
  


  



  return (
    // <Box sx={{ padding: 2 }}>
    //   {filteredBookings.map((booking) => (
    //     <Card key={booking._id} sx={{ mb: 2 }}>
    //       <CardContent>
    //         <Typography variant="h6" gutterBottom>
    //           Booking Details (ID: {booking._id})
    //         </Typography>
    //         <Typography variant="subtitle1">Process: {booking.process?.processName || 'No process name'}</Typography>
    //         <Typography variant="subtitle1">Room Number: {booking.room?.roomNumber || 'Not assigned'}</Typography>
    //         <Typography variant="subtitle1">Room Type: {booking.room?.roomType?.typeName || 'No room type'}</Typography>
    //         <Typography variant="subtitle1">Doctor Name: {booking.doctorId?.name || 'No doctor assigned'}</Typography>
    //         <Typography variant="subtitle1">Patient Name: {booking.patientId?.firstName} {booking.patientId?.lastName}</Typography>
    //         <Typography variant="subtitle1">Date: {new Date(booking.date).toLocaleDateString()}</Typography>
    //         <Typography variant="subtitle1">Time: {booking.startTime} - {booking.endTime}</Typography>
    //       </CardContent>
    //     </Card>
    //   ))}
    // </Box>

    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Booking Details
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell align="right">Process Name</TableCell>
              <TableCell align="right">Room Number</TableCell>
              <TableCell align="right">Room Type</TableCell>
              <TableCell align="right">Doctor Name</TableCell>
              <TableCell align="right">Patient Name</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow
                key={booking._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {booking._id}
                </TableCell>
                <TableCell align="right">{booking.process?.processName || 'N/A'}</TableCell>
                <TableCell align="right">{booking.room?.roomNumber || 'N/A'}</TableCell>
                <TableCell align="right">{booking.room?.roomType?.typeName || 'N/A'}</TableCell>
                <TableCell align="right">{booking.doctorId?.name || 'N/A'}</TableCell>
                <TableCell align="right">{booking.patientId ? `${booking.patientId.firstName} ${booking.patientId.lastName}` : 'N/A'}</TableCell>
                <TableCell align="right">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell align="right">{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                <TableCell align="right">
                                    <Button color="error" onClick={() => deleteBooking(booking._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingList;
