import "./message-styles.css";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export default function UserCard({ user, notSeen }) {
  function stringAvatar(name) {
    name = name.toUpperCase();
    const names = name.split(" ");
    let initials = names[0][0];
    if (names.length > 1) {
      initials += names[names.length - 1][0];
    }
    return {
      sx: {
        bgcolor: "black",
        fontSize: initials.length > 1 ? "1rem" : "1.2rem",
        color: "white",
      },
      children: initials,
    };
  }

  return (
    <ListItem
      sx={{
        cursor: "pointer",
        width: "100%",
        height: "80px",
        boxShadow: 1, 
        borderRadius: 2,
        border: "1px solid #E6E6FA",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "#E6E6FA",
        },
        "&:active": {
          backgroundColor: "#EFEFFC",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar {...stringAvatar(user.name)} />
      </ListItemAvatar>
      <ListItemText>
        <h4 style={{ textTransform: "capitalize" }}>{user.name}</h4>
        <p
          style={{
            textTransform: "capitalize",
            color: "gray",
            marginLeft: "10px",
            fontWeight: "lighter",
          }}
        >
          {user.role}
        </p>
        {notSeen > 0 && <p className="notification">{notSeen}</p>}
      </ListItemText>
    </ListItem>
  );
}
