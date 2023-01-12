import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import chatIcon from "./chatIcon2.png";

import "./App.css";
import Chat from "./components/Chat/Chat";

const socket = io(process.env.REACT_APP_URL);

const App = () => {
  const [username, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomJoined, setRoomJoined] = useState(false);

  const joinRoom = () => {
    socket.emit("join_room", { username: username, roomId: roomId });
    setRoomJoined(true);
    document.title = `Talkr - Hi, ${username}.`;
  };

  useEffect(() => {
    socket.emit("user_joined", {
      username: username,
      roomId: roomId,
    });
  }, [socket, roomJoined]);

  return (
    <div className="App">
      {!roomJoined ? (
        <div className="login-window">
          <div className="login-header">
            <img src={chatIcon} height="45" alt="" />
            <h2>Talkr - Join Room</h2>
          </div>
          <div className="input-box">
            <input
              placeholder="Enter your name"
              name="username"
              onChange={(e) => setUserName(e.target.value.trim())}
            />
            <input
              placeholder="Enter Room ID"
              name="roomId"
              onChange={(e) => setRoomId(e.target.value.trim())}
            />

            <button
              className={username !== "" && roomId !== "" ? "" : "disabled"}
              disabled={!username || !roomId}
              onClick={joinRoom}
            >
              <h3>Join Room</h3>
            </button>
          </div>
        </div>
      ) : (
        <Chat username={username} roomId={roomId} socket={socket} />
      )}
    </div>
  );
};

export default App;
