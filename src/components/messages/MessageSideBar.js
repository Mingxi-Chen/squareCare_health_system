import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  Dialog,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

import "./message-styles.css";

import UserCard from "./UserCard";
import axios from "axios";
import { UserContext } from "../../context/context";
import { toast } from "react-toastify";

const MessageSideBar = ({
  activeChat,
  setActiveChat,
  setAvailableUsers,
  setGroups,
  availableUsers,
  groups,
}) => {
  const { user, loading } = useContext(UserContext);
  const [addUser, setAddUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatAddInput, setChatAddInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSearchQuery("");
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
    setChatAddInput("");
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setChatAddInput("");
  };

  const handleAddUserClick = () => {
    if (addUser === null) {
      toast.error("select a user");
      return;
    }
    const body = {
      users: [addUser._id, user._id],
      conversation: [],
    };

    axios
      .post(`/messages`, body)
      .then(({ data }) => {
        setGroups((prev) => [...prev, data.group]);
        setAddUser(null);
        handlePopupClose();
        setAvailableUsers((prev) => prev.filter((u) => u._id !== addUser._id));
      })
      .catch((err) => console.error(err));
  };

  const handleGroupClick = (group) => {
    setActiveChat(group);
    setGroups((prev) =>
      prev.map((g) => {
        if (g._id === group._id) {
          group.notSeen = 0;
          return group;
        } else {
          return g;
        }
      })
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-sidebar">
      <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, my: 2 }}>
        Mesengers
      </Typography>
      <form onSubmit={handleFormSubmit} className="chat-search">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 2,
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={() => setSearchQuery("")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "36px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                // Targeting hover state specifically
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(120, 121, 241, 0.5)", // Your desired hover color
                },
                // Disabling hover effect when focused
                "&.Mui-focused": {
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7879F1", // Focused border color
                  },
                  // Override hover styles when focused
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7879F1", // Keep the focus color even when hovering
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "#D3D3D3",
                fontWeight: "lighter",
                "&.Mui-focused": {
                  color: "#7879F1",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="text"
            sx={{ marginRight: 5, color: "#7879F1" }}
            onClick={handleAddClick}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              CHAT
              <AddIcon sx={{ fontSize: 20, marginLeft: 0.5 }} />
            </div>
          </Button>
        </Box>
      </form>
      <div className="user-list">
        <List>
          {groups
            .filter((g) =>
              g.users?.some(
                (e) =>
                  e?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                  e?.role?.toLowerCase()?.includes(searchQuery.toLowerCase())
              )
            )
            .sort((a, b) => {
              const lastMessageDateA =
                a.conversation.length > 0
                  ? a.conversation[a.conversation.length - 1].createdAt
                  : null;
              const lastMessageDateB =
                b.conversation.length > 0
                  ? b.conversation[b.conversation.length - 1].createdAt
                  : null;

              if (lastMessageDateA && lastMessageDateB) {
                return new Date(lastMessageDateB) - new Date(lastMessageDateA);
              } else if (!lastMessageDateA && !lastMessageDateB) {
                return 0;
              } else if (!lastMessageDateA) {
                return 1;
              } else {
                return -1;
              }
            })
            .map((group) => (
              <Box key={group._id} onClick={() => handleGroupClick(group)}>
                {group.users
                  .filter((e) => e._id !== user._id)
                  .map((e) => (
                    <UserCard
                      key={e._id}
                      user={e}
                      notSeen={
                        group._id !== activeChat?._id ? group.notSeen : 0
                      }
                    />
                  ))}
              </Box>
            ))}
        </List>
      </div>

      {/** Popup for searching new mesengers */}
      <Dialog
        open={isPopupOpen}
        onClose={() => {
          handlePopupClose();
          setAddUser(null);
        }}
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            setAddUser(null);
          }
        }}
        PaperProps={{
          sx: {
            maxHeight: "60vh",
            width: "30vw",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <form className="chat-add-form" onSubmit={(e) => e.preventDefault()}>
          <TextField
            type="text"
            placeholder="Search"
            fullWidth
            variant="standard"
            value={chatAddInput}
            onChange={(event) => {
              setChatAddInput(event.target.value);
              setAddUser(null);
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: "60px",
                alignItems: "center",
                padding: "10px 14px",
              },
              "& .MuiInput-underline:before": {
                // Normal state underline color
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
              },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                // Underline color on hover (not disabled)
                borderBottom: "1px solid #E1E2FF",
              },
              "& .MuiInput-underline:after": {
                // Underline color when focused
                borderBottomColor: "#7879F1",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: chatAddInput && (
                <IconButton
                  onClick={() => {
                    setChatAddInput("");
                    setAddUser(null);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  <CloseIcon />
                </IconButton>
              ),
            }}
          />
        </form>
        <Box
          sx={{
            maxHeight: "500px",
            overflowY: "auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent:
              availableUsers.filter(
                (u) =>
                  u?.name
                    ?.toLowerCase()
                    ?.includes(chatAddInput.toLowerCase()) ||
                  u?.role?.toLowerCase()?.includes(chatAddInput.toLowerCase())
              ).length === 0
                ? "center"
                : "flex-start",
            alignItems: "center",
          }}
        >
          <List sx={{ padding: "0px", width: "100%" }}>
            {availableUsers
              .filter((u) => {
                return (
                  u?.name
                    ?.toLowerCase()
                    ?.includes(chatAddInput.toLowerCase()) ||
                  u?.role?.toLowerCase()?.includes(chatAddInput.toLowerCase())
                );
              })
              .map((user) => (
                <div
                  key={user._id}
                  onClick={() => setAddUser(user)}
                  className={
                    addUser?._id === user._id ? "add-user-selected" : ""
                  }
                  style={{
                    backgroundColor: addUser?._id === user._id ? "#E6E6FA" : "",
                    cursor: "pointer",
                  }}
                >
                  <UserCard user={user} />
                </div>
              ))}
            {availableUsers.filter(
              (u) =>
                u?.name?.toLowerCase()?.includes(chatAddInput.toLowerCase()) ||
                u?.role?.toLowerCase()?.includes(chatAddInput.toLowerCase())
            ).length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <DoNotDisturbAltIcon
                  sx={{ fontSize: 40, color: "text.secondary" }}
                />
                <Typography variant="body1" sx={{ fontSize: "large" }}>
                  No user found
                </Typography>
              </Box>
            )}
          </List>
        </Box>
        <DialogActions>
          <Button
            onClick={() => {
              handleAddUserClick();
              setAddUser(null);
            }}
            sx={{
              bgcolor: "#7879F1",
              color: "white",
              height: 36,
              minWidth: 64,
              maxWidth: 80,
              width: "100px",
              padding: "6px 16px",
              "&:hover": {
                bgcolor: "rgba(72, 73, 221, 1)",
              },
              "&:active": {
                bgcolor: "rgba(62, 63, 211, 1)",
              },
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              handlePopupClose();
              setAddUser(null);
            }}
            variant="text"
            sx={{
              color: "rgba(72, 73, 221, 1)",
              height: 36,
              minWidth: 64,
              maxWidth: 80,
              width: "100px",
              padding: "6px 16px",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default MessageSideBar;
