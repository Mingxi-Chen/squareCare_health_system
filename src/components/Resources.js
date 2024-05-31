import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  TableContainer,
  Table,
  Chip,
  Box
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Sidebar from "../components/SideBar";
import axios from 'axios';
import { API_URL } from "../App";
import EditIcon from '@mui/icons-material/Edit';

const Resources = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [createNewRoom, setNewRoom] = useState(false);
  const [showAddRoom, setAddRoom] = useState(false);
  const [open, setOpen] = useState(false);
  const [rooms,setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableRoom, setEditableRoom] = useState({ roomType: '', roomNumber: '' });
  const [filteredRooms, setFilteredRooms] = useState([]); // New filtered rooms state

  const openAddRoom =() =>{
    setAddRoom(true);
  }

  const closeAddRoom = ()=>{
    setAddRoom(false);
  }


  // Function to handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    // Filter the rooms based on the search query
    const filtered = rooms.filter(room =>
      room.roomType.toString().toLowerCase().includes(query) ||
      room.roomNumber.toString().toLowerCase().includes(query) // Safely convert to string before calling toLowerCase
    );
    console.log(filtered);
  
    setFilteredRooms(filtered);
  };
  

  const handleEdit = (room) => {
    // setEditableRoom({});
    setEditableRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    console.log(selectionModel);
    if (selectionModel.length === 0) {
      alert('No rooms selected');
      return;
    }
    if (window.confirm('Are you sure you want to delete the selected rooms?')) {
    try {
      const response = await axios.post("/api/roomRoute/deleteRooms", { ids: selectionModel });
      if (response.status === 200) {
        console.log('Rooms deleted successfully');
        // Update local state to reflect the deletion
        // Update local state to reflect the deletion
        setRooms(prevRooms => prevRooms.filter(room => !selectionModel.includes(room._id)));
        setFilteredRooms(prevFiltered => prevFiltered.filter(room => !selectionModel.includes(room._id)));
        setSelectionModel([]); // Clear selection after deletion
      } else {
        console.error('Failed to delete rooms');
      }
    } catch (error) {
      console.error('Error deleting rooms', error);
    }
    } else {
      // If the user clicks "Cancel", log cancellation and do nothing
      console.log('Deletion cancelled by user.');
    }
  };
  


  const columns = [
    { field: "roomType", headerName: "Room Type", flex: 1 },
    { field: "roomNumber", headerName: "Room Number", flex: 1 },
    {
      field: 'filledStatus',
      headerName: 'Filled Status',
      width: 130,
      renderCell: (params) => {
        const status = params.value;
        const getColor = (status) => {
          // if (status.includes('Full')) return 'error';
          // if (status.includes('Empty')) return 'success';
          return 'warning';
        };
        return <Chip label={status} color={getColor(status)} />;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => {
        return (
          <ColorButton
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            
            sx={{ minWidth: '30px', padding: '8px 10px', fontSize: '0.65rem' }}
          >
            Edit
          </ColorButton>
        );
      }
    }
    
  ];


  
  // From Ming
  // use url from Auth
  
  useEffect(()=>{
    const fetchRooms = async () =>{
      try{
        // const response = await axios.get("/auth/allRoom");
        const response = await axios.get("/api/roomRoute/allRoom");
        console.log(response.data);

        setRooms(response.data);
        setFilteredRooms(response.data); // Initialize filteredRooms with all rooms on fetch
      }catch (error){
        console.error('Failed to fetch rooms', error);
      }
    }
    fetchRooms();
  },[])

  const handleSelectionChange = async (newSelectionModel) => {
    console.log("Selected Rows IDs: ", newSelectionModel);
    const newSelectionModelIds = newSelectionModel.map(id => id.toString());
    setSelectionModel(newSelectionModelIds);


  };

  return (
    <main style={{ display: "flex",overflow: "hidden" }}>
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
    <div className="account-wrapper" style={{ flexGrow: 1, minWidth: '300px'}}>
      {/*Display "Resources" on top Left */}
      <Typography variant="h5">Resources</Typography>

      {/* New Room button*/}
      <Box sx={{ display: 'flex', justifyContent:"flex-end" }}>
        <ColorButton
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={openAddRoom}
        >
          Add Room
        </ColorButton>
          <Box> {showAddRoom && (
        <CreateAddRoomWindow 
          closeWindow={closeAddRoom} 
          setRooms={setRooms} 
          setFilteredRooms={setFilteredRooms}  // Correct way to pass setFilteredRooms
        />  
        )}</Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeleteSelected}
        disabled={selectionModel.length === 0}
        startIcon={<DeleteIcon />}
      >
      </Button>
      {/* ... other buttons like Add Room or Edit Room */}
       </Box>



      {/**Table of Patients */}
      <TableContainer className="account-table-container">
        {/** Search Field */}
        <TextField
          label="Search..."
          value={searchQuery}
          variant="outlined"
          className="accounts-search"
          sx={{ my: 1, width: "100%" }}
          size="small"
          onChange={handleSearchChange}
        />
        <Table>
          <DataGrid
            className="data-table"
            rows={filteredRooms}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 15]}
            checkboxSelection


            onRowSelectionModelChange={(newSelectionModel) => {
              handleSelectionChange(newSelectionModel);
            }}
            rowSelectionModel={selectionModel}
            // getRowId={(row) => row._id.toString()}
            getRowId={(row) => row._id ? row._id.toString() : ''}

            autoHeight
            
          />
        </Table>
      </TableContainer>
      
    </div>
    {/* <EditRoomModal
      open={isModalOpen}
      handleClose={() => setIsModalOpen(false)}
      room={editableRoom}
      onSave={(updatedRoom) => {
        const updatedRooms = rooms.map(room => {
          if (room._id === editableRoom._id) {
            return { ...room, ...updatedRoom };
          }
          return room;
        });
        setRooms(updatedRooms);
        axios.put(`/api/roomRoute/updateRoom/${editableRoom._id}`, updatedRoom)
        .then(response => {
          console.log('Update successful:', response.data);
          // Optionally refresh data or handle further UI updates here
         
        })
        .catch(error => {
          console.error('Failed to update room:', error);
          // Revert UI changes if necessary or notify user of error
          console.log(error.response.data);
          if(error.response && error.response.status ===404){
            alert(error.response.data.message);
          }
          else{
            alert ('An error occurred while updating the room. Please try again.');
          }
   
        });

      }}
    /> */}
    <EditRoomModal
  open={isModalOpen}
  handleClose={() => setIsModalOpen(false)}
  room={editableRoom}
  onSave={(updatedRoom) => {
    // Optimistically update the UI before the API response
    const updatedRooms = rooms.map(room => room._id === editableRoom._id ? { ...room, ...updatedRoom } : room);
    setRooms(updatedRooms);  // Update the local state with the new room details

    axios.put(`/api/roomRoute/updateRoom/${editableRoom._id}`, updatedRoom)
    .then(response => {
      if (response.status === 200) {
        console.log('Update successful:', response.data);
        // Since the update was successful, confirm the optimistic update
        alert('Room updated successfully!');
      } else {
        // If the update wasn't successful, revert to the original rooms state
        console.error('Failed to update room:', response.data);
        setRooms(rooms);  // Revert to the original rooms state
        alert('Failed to update the room.');
      }
    })
    .catch(error => {
      console.error('Error updating room:', error);
      // Revert to the original rooms state in case of error
      setRooms(rooms);
      alert('An error occurred while updating the room: ' + (error.response?.data?.message || error.message));
    })
    .finally(() => {
      setIsModalOpen(false);  // Close the modal regardless of the outcome'
      window.location.reload();
    });
  }}
/>

    </main>



  );
};

const CreateAddRoomWindow = ({ closeWindow, setRooms, setFilteredRooms })=>{
  const [nextId, setNextId] = useState(0);
  const [roomData,setRoomData] = useState({
    roomType:'',
    roomNumber: '',
    roomSize:''
  })

  const handleChange = (event) =>{
    const {name,value}=event.target;
    setRoomData(prevState => ({
      ...prevState,
      [name]: value
  }));
}

async function addRoomAndDetails(roomData) {
  try {
      // Assuming roomData is already properly structured and includes necessary details
      const response = await axios.post("/api/roomRoute/addRoom", roomData, {
          headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Room added successfully', response.data);  // Debugging output

      if (response.status === 200) {
          // Response contains the new room details
          const newRoom = response.data.data;

          // Update rooms state
          setRooms(prevRooms => {
              const updatedRooms = [...prevRooms, newRoom];
              return updatedRooms;
          });

          setFilteredRooms(prevFiltered => [...prevFiltered, newRoom]);
          // Increment the ID counter for the next room addition, if applicable
          setNextId(prevId => prevId + 1);

          // Close the modal window after successful addition
          closeWindow();
      } else {
          console.error('Failed to add room', response.data);
      }
  } catch (error) {
      console.error('Error sending room data', error);
      alert('Failed to add room due to an error: ' + (error.response?.data?.message || error.message));
  }
}
  

  const handleSubmit = async(event)=>{
    event.preventDefault();
    const filledStatus = `0/${roomData.roomSize}`;
    const roomWithId = { ...roomData,filledStatus, id: nextId };
    console.log("Sending data:", roomWithId);  // Check what data is being sent
    // try{
    //      const response = await axios.post("/api/roomRoute/addRoom", roomWithId, { // Make sure to send roomWithId, not roomData
    //       headers: {
    //           'Content-Type': 'application/json'
    //       }
    //   });
    //   console.log('325 Room added successfully', response.data);
    //   if (response.status === 200) {
    //     console.log('Room added successfully', response.data);
    //     setRooms(prevRooms => {
    //         const updatedRooms = [...prevRooms, response.data];
    //         // Optionally update filteredRooms based on search criteria
    //         setFilteredRooms(updatedRooms);
    //         return updatedRooms;
    //     });
    //     setNextId(prevId => prevId + 1);
    //     closeWindow();
    //    }  else {
    //       console.error('Failed to add room', response.data);
    //   }

    // } catch(error){
    //   console.error('Error sending room data', error);
    // }
    await addRoomAndDetails(roomWithId);
    window.location.reload();
  }


  return(
      <Modal
      open={true} // Controlled by your state
      onClose={closeWindow}
      aria-labelledby="add-room-modal-title"
      aria-describedby="add-room-form-description"
  >
      <Box sx={style}>
          <IconButton
              aria-label="close"
              onClick={closeWindow}
              sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
              }}
          >
          <CloseIcon />
          </IconButton>
          <Typography id="add-room-modal-title" variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
              Add Room
          </Typography>
          <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}
          >
              <TextField 
                name="roomType"
                label="Room Type" 
                placeholder="Room Type" 
                fullWidth 
                value={roomData.roomType}
                onChange={handleChange}
              />
              <TextField
                name="roomNumber"
                label="Room Number"
                placeholder="101"
                fullWidth
                value={roomData.roomNumber}
                onChange={handleChange}
                  />
              <TextField
                name="roomSize"
                label="Room Size"
                placeholder="2"
                type="number"
                fullWidth
                value={roomData.roomSize}
                onChange={handleChange}
                />
              <Box gridColumn="span 1" >
                  <Button variant="contained" type="submit" fullWidth sx={{ mt: 3 }}>
                      Add Now
                  </Button>
              </Box>
          </Box>
      </Box>
  </Modal>
  )
}

const EditRoomModal = ({ open, handleClose, room, onSave }) => {
const [formValues, setFormValues] = useState({ roomType: room.roomType, roomNumber: room.roomNumber });

useEffect(() => {
  // Update form values when room props change, this happens when the modal is opened
  setFormValues({ roomType: "", roomNumber: ""});
}, [room]);

useEffect(() => {
  // Effect to reset the form when modal closes
  if (!open) {
    setFormValues({ roomType: '', roomNumber: '' }); // Reset to initial or empty values
  }
}, [open]);

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormValues(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = () => {
  onSave(formValues);
  handleClose();
};

return (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="edit-room-modal"
    aria-describedby="edit-room-form"
  >
    <Box sx={{ ...modalStyle, width: 400 }}>
      <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
          }}
      >
      <CloseIcon />
      </IconButton>
      <Typography id="edit-room-modal" variant="h6" component="h2">Edit Room</Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Room Type"
        name="roomType"
        value={formValues.roomType}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Room Number"
        name="roomNumber"
        value={formValues.roomNumber}
        onChange={handleChange}
      />
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleSubmit}
      >
        Save Changes
      </Button>
    </Box>
  </Modal>
);
};

const modalStyle = {
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
bgcolor: 'background.paper',
boxShadow: 24,
p: 4,
outline: 'none'
};


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none' // Removes the default focus outline
};

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#5932EA"),
  backgroundColor: "#5932EA",
  '&:hover': {
      backgroundColor: "#5932EA",
  },
  }));



export default Resources;
