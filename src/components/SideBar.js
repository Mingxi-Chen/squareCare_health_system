import React, { useContext,useEffect,useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import { UserContext } from "../context/context";
import { LS_AUTH_KEY } from "../context/config";

const sidebarData = [
  // System Administrator items (assuming you have a role check for this)
  {
    text: "Dashboard",
    path: "DashBoard",
    icon: <DashboardIcon />,
    role: ["System Admin"],
  },
 
  {
    text: "Messages",
    path: "Messages",
    icon: <MessageIcon />,
    role: ["System Admin"],
  },
  {
    text: "Accounts",
    path: "AccountManagement",
    icon: <AccountCircleIcon />,
    role: ["System Admin"],
  },

  // Caregiver items
  {
    text: "Dashboard",
    path: "DashBoard",
    icon: <DashboardIcon />,
    role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
  },
  
  {
    text: "Notification",
    path: "Notification",
    icon: <NotificationsIcon />,
    role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
    isNotification: true
  },
  
  {
    text: "Messages",
    path: "Messages",
    icon: <MessageIcon />,
    role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
  },
  {
    text: "Patients",
    path: "patients",
    icon: <PeopleIcon />,
    role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
  },
  {
    text: "Resources",
    path: "Resources",
    icon: <HotelIcon />,
    role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
  },
  // {
  //   text: "Profile",
  //   path: "StaffManagementPage",
  //   icon: <PersonIcon />,
  //   role: ["Doctor", "Hospital Admin", "Nurse", "Technician"],
  // },
];

const SideBar = ({ open, setOpen }) => {
  const { setUser, user, loading } = useContext(UserContext);
  const [hasNotifications, setHasNotifications] = useState(false);
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
};
  useEffect(()=>{
    if(!user)
      return;

        const ws = new WebSocket(getWebSocketUrl());
        ws.onopen = ()=> {
          ws.send(JSON.stringify({type: 'authenticate', userId: user._id}))
        }
    
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if(data.type === 'notification')
            {
              console.log("Notification received")
              setHasNotifications(true);
            }
        }
    
        return ()=> ws.close;
      

  },[user])

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const NavListItem = styled(ListItem)(({ theme }) => ({
    marginTop: "20px",
    background: "transparent",
    ":hover": {
      background: "#7879F1",
      color: "white",
    },
    "& .MuiListItemIcon-root": {
      minWidth: "40px",
      justifyContent: "center",
    },
  }));

  const handleLogout = () => {
    localStorage.removeItem(LS_AUTH_KEY);
    setUser({});
    navigate("/");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  //Yunjia for notification 

  const getWebSocketUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return "wss://yunjiaapp-c337d89ea438.herokuapp.com";
    } else {
      return "ws://localhost:8000";
    }
  };




  return (
    <Drawer
      open={open}
      variant="permanent"
      onClose={toggleDrawer}
      sx={{
        zIndex: 999,
        width: open ? 240 : 40,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 240 : 90,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        <ListItem id="logo" onClick={toggleDrawer} style={{ cursor: "pointer" }}>
          <ListItemIcon style={{ justifyContent: "center" }}>
            <img
              src="/logo.png"
              alt="logo"
              style={{ height: "2em", width: "auto" }}
            />
          </ListItemIcon>
          {open && <ListItemText primary="Square Care" />}
        </ListItem>
        <Divider />
        {sidebarData
          .filter((item) => item.role.includes(user.role))
          .map((item) => (
            <NavLink
              to={`/${item.path.toLowerCase()}`}
              key={item.path}
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              <NavListItem
                style={{
                  cursor: "pointer",
                  justifyContent: "center",
                  ":hover": {
                    background: "#7879F1",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon>{item.icon}  {item.isNotification && hasNotifications && (
            <div style={{ height: '10px', width: '10px', backgroundColor: 'red', borderRadius: '50%' }}></div>
          )}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
              </NavListItem>
            </NavLink>
          ))}
        <Divider />
        <NavListItem
          id="logout_button"
          onClick={handleLogout}
          style={{
            cursor: "pointer",
            justifyContent: "center",
            ":hover": {
              background: "#7879F1",
              color: "white",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Logout"
              sx={{ flexGrow: 0, flexBasis: "auto", padding: 0 }}
            />
          )}
        </NavListItem>
      </List>
    </Drawer>
  );
};

export default SideBar;
