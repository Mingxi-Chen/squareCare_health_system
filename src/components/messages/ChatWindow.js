import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/context";
import MessageBar from "./MessageBar";
import MessageCard from "./MessageCard";
import { AppBar, Toolbar, ListItemAvatar, Avatar } from "@mui/material";

import "./message-styles.css";
import { toast } from "react-toastify";
import axios from "axios";

export default function ChatWindow({ group, setActiveChat, sendMessage }) {
  const { user, loading } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [group]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSend = (msg) => {
    let body = {
      text: msg,
      createdAt: new Date().toISOString(),
      author: user._id,
    };

    axios
      .post(`/messages/conversation/${group._id}`, body)
      .then(({ data }) => {
        if (data.success) {
          setActiveChat(data.group);
          sendMessage(
            JSON.stringify({
              eventType: "message",
              roomId: group._id,
              group: data.group,
            })
          );
        } else {
          toast.error(data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      });
  };

  const otherUser = group.users.filter((e) => e._id !== user._id)[0];

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
    <section className="main-chat-window">
      {/** Chat window header */}
      <AppBar position="static" sx={{ borderRadius: "10px" }}>
        <Toolbar
          sx={{
            bgcolor: "#fdfdff",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <div
            className="chat-title"
            style={{
              display: "flex",
              alignItems: "center",
              height: "125px",
              maxHeight: "10vh",
            }}
          >
            <ListItemAvatar>
              <Avatar {...stringAvatar(otherUser.name)} />
            </ListItemAvatar>
            <div>
              <h4 style={{ textTransform: "capitalize" }}>{otherUser.name}</h4>
              <p
                style={{
                  textTransform: "capitalize",
                  color: "gray",
                  marginLeft: "10px",
                }}
              >
                {otherUser.role}
              </p>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {/** Chat window content */}
      <div className="chat-content" style={{ width: "100%" }}>
        {group.conversation && group.conversation.length > 0 ? (
          group.conversation.map((msg, id) => (
            <div className="chat-card" key={id}>
              <MessageCard
                message={msg}
                user={msg.author}
                own={msg.author._id === user._id}
              />
            </div>
          ))
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: "24px",
              color: "gray",
            }}
          >
            Start Chatting
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/** Message bar for sending messages*/}
      <div>
        <MessageBar onSend={onSend} />
      </div>
    </section>
  );
}
