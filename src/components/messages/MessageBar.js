import React, { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "./message-styles.css";
import { toast } from "react-toastify";

const MessageBar = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSend = () => {
    if (message.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }
    onSend(message);
    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        border: isFocused ? "2px solid #5932EA" : "1px solid #ddd",
        height: "100%",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
      className="message-bar"
    >
      <TextField
        style={{ flexGrow: 1, height: "48px" }}
        variant="outlined"
        placeholder="Type a message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
          },
        }}
      />
      <IconButton onClick={handleSend} style={{ height: "48px" }}>
        <SendIcon sx={{ color: "#5932EA" }} />
      </IconButton>
    </div>
  );
};
export default MessageBar;
