import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSocket from "./hooks/socketConnect";

import FriendList from "./components/FriendList/FriendList";
import Messenger from "./components/Messenger/Messenger";
import Navbar from "./components/Navbar/Navbar";

import "./Chat.scss";

const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);

  useSocket(user, dispatch);

  return (
    <div id="chat-container">
      <Navbar />
      <div id="chat-wrap">
        <FriendList />
        <Messenger />
      </div>
    </div>
  );
};

export default Chat;
