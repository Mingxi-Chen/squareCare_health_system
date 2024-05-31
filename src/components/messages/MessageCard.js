import "./message-styles.css";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export default function MessageCard({ user, message, own }) {
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
      sx={{ width: "100%" }}
      className={own ? "card-item own" : "card-item"}
    >
      <ListItemAvatar>
        <Avatar {...stringAvatar(user.name)} />
      </ListItemAvatar>
      <ListItemText
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: own ? "flex-end" : "flex-start",
          overflowWrap: "break-word",
        }}
      >
        {message.text !== "" && <p className="message-text">{message.text}</p>}
        <p className="message-time">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </ListItemText>
    </ListItem>
  );
}
