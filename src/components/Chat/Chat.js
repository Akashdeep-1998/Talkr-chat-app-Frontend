import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import ScrollToBottom from "react-scroll-to-bottom";

import sendButton from "../../sendButton.png";
import chatIcon from "../../chatIcon2.png";

import "./Chat.css";

const Chat = (props) => {
  const [message, setMessage] = useState({text:""});
  const [messageList, setMessageList] = useState([
    {
      username: props.username,
      text: `Welcome ${props.username}!`,
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      newJoined: true,
    },
  ]);

  const onChangeHandler = (e) => {
    setMessage({
      username: props.username,
      roomId: props.roomId,
      text: e.target.value,
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    });
  };

  const sendMessage = async () => {
    if (message.text !== "") {
      await props.socket.emit("send_message", message);
      setMessageList([...messageList, message]);
    }

    setMessage({ text: "" });
  };

  useEffect(() => {
    props.socket.on("new_user_joined", (userData) => {
      setMessageList([
        ...messageList,
        {
          text: `${userData.username} joined the room!`,
          username: userData.username,
          time: new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          newJoined: true,
        },
      ]);
    });

    props.socket.on("receive_message", (messageData) => {
      setMessageList([...messageList, messageData.message]);
    });

    props.socket.on("left", (user) => {
      setMessageList([
        ...messageList,
        {
          text: `${user.username} left the room.`,
          time: new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          userLeft: true,
        },
      ]);
    });
  }, [props.socket, messageList]);

  return (
    <>
      <div className="chat-window">
        <div className="chat-header">
          <img src={chatIcon} height="45" alt="" />
          <h2>Talkr</h2>
          <h4>
            Hi {props.username.split(" ")[0]}
            <span style={{ color: "#31e331" }}>&nbsp;&#x2022;</span>
          </h4>
        </div>
        <div className="message-body">
          <ScrollToBottom className="scrollBottom">
            {messageList.map((messageData) => (
              <div
                key={uuid()}
                className={`message ${
                  props.username === messageData.username ? "right" : "left"
                }`}
              >
                {!messageData.newJoined && !messageData.userLeft ? (
                  <b>
                    {props.username === messageData.username
                      ? "You"
                      : messageData.username}
                    :&nbsp;
                  </b>
                ) : null}
                <p className="message-para">{messageData.text}</p>
                <small>
                  <blockquote>{messageData.time}</blockquote>
                </small>
              </div>
            ))}
          </ScrollToBottom>
        </div>
      </div>
      <div className="message-footer">
        <input
          placeholder="Write a message..."
          value={message.text}
          onChange={onChangeHandler}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <img src={sendButton} height="40" alt="" onClick={sendMessage} />
      </div>
    </>
  );
};

export default Chat;
