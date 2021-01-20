import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MessageInput.scss";
import ChatService from "../../../../services/chatService";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { incrementScroll } from "../../../../store/actions/chat";

const MessageInput = ({ chat }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.authReducer.user);
  const socket = useSelector((state) => state.chatReducer.socket);
  const newMessage = useSelector((state) => state.chatReducer.newMessage);

  const fileUpload = useRef();
  const msgInput = useRef();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState("");
  const [showNewMessageNotification, setShowNewMessageNotification] = useState(
    false
  );

  const handleMessage = (e) => {
    const value = e.target.value;
    setMessage(value);

    const receiver = {
      chatId: chat.id,
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
    };

    if (value.length === 1) {
      receiver.typing = true;
      socket.emit("typing", receiver);
    }

    if (value.length === 0) {
      receiver.typing = false;
      socket.emit("typing", receiver);
    }
  };

  const handleKeyDown = (e, imageUpload) => {
    if (e.key === "Enter") sendMessage(imageUpload);
  };

  const sendMessage = (imageUplaod) => {
    if (message.length < 1 && !imageUplaod) return;

    const msg = {
      type: imageUplaod ? "image" : "text",
      fromUser: user,
      toUserId: chat.Users.map((user) => user.id),
      chatId: chat.id,
      message: imageUplaod ? imageUplaod : message,
    };

    setMessage("");
    setImage("");
    setShowEmojiPicker(false);

    // send message with socket
    socket.emit("message", msg);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("id", chat.id);
    formData.append("image", image);

    ChatService.uploadImage(formData)
      .then((image) => sendMessage(image))
      .catch((err) => console.log(err));
  };

  const selectEmoji = (emoji) => {
    const startPosition = msgInput.current.selectionStart;
    const endPosition = msgInput.current.selectionEnd;
    const emojiLength = emoji.native.length;
    const value = msgInput.current.value;
    setMessage(
      value.substring(0, startPosition) +
        emoji.native +
        value.substring(endPosition, value.length)
    );
    msgInput.current.focus();
    msgInput.current.selectionEnd = endPosition + emojiLength;
  };

  const showNewMessage = () => {
    dispatch(incrementScroll());
    setShowNewMessageNotification(false);
  };

  useEffect(() => {
    const msgBox = document.getElementById("msg-box");
    if (
      !newMessage.seen &&
      newMessage.chatId === chat.id &&
      msgBox.scrollHeight !== msgBox.clientHeight // test if there is a scroll been showed
    ) {
      if (msgBox.scrollTop > msgBox.scrollHeight * 0.3) {
        dispatch(incrementScroll(incrementScroll));
      } else {
        setShowNewMessageNotification(true);
      }
    } else {
      setShowNewMessageNotification(false);
    }
  }, [newMessage, dispatch]);

  return (
    <div id="input-container">
      <div id="image-upload-container">
        <div>
          {showNewMessageNotification ? (
            <div id="message-notification" onClick={showNewMessage}>
              <FontAwesomeIcon icon="bell" className="fa-icon" />
              <p className="m-0">New message</p>
            </div>
          ) : null}
        </div>

        <div id="image-upload">
          {image.name ? (
            <div id="image-details">
              <p className="m-0">{image.name}</p>
              <FontAwesomeIcon
                onClick={handleImageUpload}
                icon="upload"
                className="fa-icon"
              />
              <FontAwesomeIcon
                onClick={() => setImage("")}
                icon="times"
                className="fa-icon"
              />
            </div>
          ) : null}
          <FontAwesomeIcon
            onClick={() => fileUpload.current.click()}
            icon={["far", "image"]}
            className="fa-icon"
          />
        </div>
      </div>
      <div id="message-input">
        <input
          ref={msgInput}
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />
        <FontAwesomeIcon
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          icon={["far", "smile"]}
          className="fa-icon"
        />
      </div>

      <input
        id="chat-image"
        ref={fileUpload}
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {showEmojiPicker ? (
        <Picker
          title="Pick you emoji..."
          emoji="point_up"
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
          onSelect={selectEmoji}
        ></Picker>
      ) : null}
    </div>
  );
};

export default MessageInput;
