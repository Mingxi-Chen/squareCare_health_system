import React, { useState, useEffect, useContext, useRef } from "react";
import MessageSideBar from "./messages/MessageSideBar.js";
import ChatWindow from "./messages/ChatWindow.js";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../context/context.js";
import "./messages/message-styles.css";

export default function MessagePanel() {
  const [activeChat, setActiveChat] = useState(null);
  const activeChatRef = useRef(activeChat);
  const [sockets, setSockets] = useState({});
  const { user, loading } = useContext(UserContext);
  const wsRef = useRef(null);

  const [availableUsers, setAvailableUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const groupsRef = useRef(null);

  const getWebSocketUrl = () => {
    if (process.env.NODE_ENV === "production") {
      return "wss://dep-test-addba2d6aa58.herokuapp.com";
    } else {
      return "ws://localhost:8000";
    }
  };

  useEffect(() => {
    activeChatRef.current = activeChat;
    groupsRef.current = groups;

    groups.forEach((g) => {
      if (!sockets[g?._id]) {
        const ws = new WebSocket(getWebSocketUrl());
        ws.onopen = () => {
          if (!g) return;
          ws.send(
            JSON.stringify({
              eventType: "join",
              roomId: g?._id,
            })
          );
        };

        ws.onmessage = function (event) {
          processMessage(event);
        };

        ws.onclose = (event) => {
          console.log(
            `Server disconnected with close code ${event.code} and reason: ${event.reason}`
          );

          if (event.code === 1000) {
            // Optionally, check the reason or other conditions before reconnecting
            // reconnect();
          }
        };

        setSockets((prev) => ({
          ...prev,
          [g._id]: ws,
        }));

        wsRef.current = ws;
      }
    });
    const processMessage = function (event) {
      const { group } = JSON.parse(event.data);

      const newGroups = groupsRef.current.map((g) => {
        if (g._id === group._id) {
          group.notSeen = (g.notSeen || 0) + 1;
          return group;
        } else {
          return g;
        }
      });

      setGroups(newGroups);
      groupsRef.current = newGroups;

      if (group._id === activeChatRef.current?._id) {
        setActiveChat(group);
      }
    };

    return () => {
      // const ws = wsRef.current;
      // if (ws) {
      //   ws.close();
      // }
    };
  }, [activeChat, user._id, groups]);

  useEffect(() => {
    axios
      .get(`/messages/available/${user._id}`)
      .then(({ data }) => {
        if (data.success) {
          setAvailableUsers(data.users);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => toast.error(err.message));

    axios.get(`/messages/${user._id}`).then(({ data }) => {
      if (data.success) {
        setGroups(data.groups);
        setActiveChat(data.groups[0]);
      } else {
        toast.error(data.error);
      }
    });
  }, [user._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const sendMessage = (message) => {
    if (
      sockets[activeChat._id] &&
      sockets[activeChat._id].readyState === WebSocket.OPEN
    ) {
      sockets[activeChat._id].send(message);
    } else {
      console.error("Cannot send message. WebSocket is not open.");

    }
    const { group } = JSON.parse(message);
    setGroups((prev) => prev.map((g) => (g._id === group._id ? group : g)));
    setActiveChat(group);
  };


  return (
    <div className="chat-wrapper">
      <MessageSideBar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        availableUsers={availableUsers}
        groups={groups}
        setAvailableUsers={setAvailableUsers}
        setGroups={setGroups}
      />
      <div className="chat-main">
        {activeChat && (
          <ChatWindow
            group={activeChat}
            setActiveChat={setActiveChat}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
}
