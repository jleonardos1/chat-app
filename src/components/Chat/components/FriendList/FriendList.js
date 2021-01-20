import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "../../../../store/actions/chat";
import Friend from "../Friend/Friend";
import Modal from "../../../Modal/Modal";
import "./FriendList.scss";
import ChatService from "../../../../services/chatService";

const FriendList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chatReducer.chats);
  const socket = useSelector((state) => state.chatReducer.socket);

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const openChat = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  const searchFriends = (e) => {
    if (e.target.value && e.target.value.length > 0)
      ChatService.searchUsers(e.target.value).then((res) =>
        setSuggestions(res)
      );
  };

  const addNewFriend = (id) => {
    ChatService.createChat(id)
      .then((chats) => {
        socket.emit("add-friend", chats);
        setShowFriendsModal(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div id="friends" className="shadow-light">
      <div id="title">
        <h3 className="m-0">Friends</h3>
        <button onClick={() => setShowFriendsModal(!showFriendsModal)}>
          ADD
        </button>
      </div>

      <hr />

      <div id="friends-box">
        {chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <Friend click={() => openChat(chat)} chat={chat} key={chat.id} />
            );
          })
        ) : (
          <p id="no-chat">No friends added</p>
        )}
      </div>

      {showFriendsModal && (
        <Modal click={() => setShowFriendsModal(!showFriendsModal)}>
          <Fragment key="header">
            <h3 className="m-0">Create a new chat</h3>
          </Fragment>

          <Fragment key="body">
            <p>Find friends by typing their name bellow</p>
            <input
              onKeyUp={(e) => searchFriends(e)}
              type="text"
              placeholder="Search..."
            />
            <div id="suggestions">
              {suggestions.map((user) => {
                return (
                  <div key={user.id} className="suggestion">
                    <p className="m-0">
                      {user.firstName} {user.lastName}
                    </p>
                    <button onClick={() => addNewFriend(user.id)}>ADD</button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        </Modal>
      )}
    </div>
  );
};

export default FriendList;
