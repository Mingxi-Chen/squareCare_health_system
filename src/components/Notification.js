import React, {useState,useContext,useEffect} from 'react';
import { List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Button, Box, Divider, Pagination } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Sidebar from "../components/SideBar";
import { UserContext } from '../context/context';
import axios from 'axios';


const avatarColors = {
    'Doctor': '#74BDCB',
    'Nurse': '#EFE7BC',
    'Technician': '#E7F2F8',
    'Hospital staff': '#FFA384 ',
    'System admin': 'grey'
};


const Notification = () =>{
    const { setUser, user, loading } = useContext(UserContext);
    const [notifications,setNotifications] = useState([]);

    useEffect(()=>{
      if(user)
        {
          fetchNotifications();
        }
    },[user])

    const fetchNotifications = async()=>{
      try{
        const response = await axios.get(`/notification/${user._id}`)
        setNotifications(response.data);
      }
      catch(error)
      {
        console.error("Error fetching notifications: ", error);
      }
    }

    const [notifs, setNotifs] = useState(notifications);
    const [notifsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastNotif = currentPage * notifsPerPage;
    const indexOfFirstNotif = indexOfLastNotif - notifsPerPage;
    const currentNotifs = notifs.slice(indexOfFirstNotif, indexOfLastNotif);
    const [open, setOpen] = useState(false);

    const totalPages = Math.ceil(notifs.length / notifsPerPage);

    const handleChangePage = (event, newPage) => {
      setCurrentPage(newPage);
    };

    const getInitials = (name) =>{
      return name.split(' ').map((n)=>n[0]).join('').toUpperCase();
    }
    const markAsRead = async (id) => {
        // Here you would handle marking the notification as read
        await axios.delete(`/notification/${id}`)
        fetchNotifications();
      };

    const markAllAsRead = async(id)=>{
      try{
        const response = await axios.delete(`notification/deleteAll/${id}`)
          fetchNotifications();
      }
      catch(error){
        console.error("Error deleting notifications: ", error)
      }
    }

    return(
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
       <Box sx={{ width: '80%', bgcolor: 'background.paper'}}>
        <h1>Notification</h1>
        <Box sx={{ display: 'flex', justifyContent:"flex-end" }}>
        <StyledButton variant="text" onClick = {()=> markAllAsRead(user._id)}>Mark All as Read</StyledButton>
        </Box>
        <List >
            {notifications.length > 0 ? (notifications.map((notif,index)=>(
                <React.Fragment key={notif._id}>
                <ListItem 
                secondaryAction={
                    <IconButton edge="end" aria-label="mark as read" onClick={() => markAsRead(notif._id)}>
                    <DoneIcon />
                    </IconButton>
                }
                >
                    <ListItemIcon>
                    <Avatar className="halfspace" sx={{ marginLeft: 10, bgcolor: avatarColors[notif.type] || '#B5E5CF',  width: 90, height: 90 }}>{getInitials(user.name)}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={`${user.role} ${user.name}`} 
                    secondary={`${notif.content} - Message send at ${new Date(notif.time).toLocaleDateString()}`} 
                    primaryTypographyProps={{ mb: 0.5 }} 
                    sx={{padding: '20px' }} />
                </ListItem>
                </React.Fragment>
            ))) : (
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mx: 2, my: 2 }}>
              No Notifications yet.
              </Typography>
            )}

        
        </List>
        {/* Pagination can be controlled with state if needed */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
             <Pagination count={10} color="primary" /> 
        </Box> */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
          </Box>

    
    
      </Box>
    
    </main>
    )
 
    
}


const StyledButton = styled(Button)({
    backgroundColor: '#CFD0E9', // Light purple background color
    color: 'black', // Text color
    padding: '3px 10px', // Button padding
    borderRadius: '10px', // Fully rounded edges
    textTransform: 'none', // Prevent uppercase text
        '&:hover': {
      backgroundColor: '#C7C8D9', // Slightly darker color on hover
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: '#5932EA',
      },
    },
  });


export default Notification;
