import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useContext, createContext } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userInfo);

    if (!userInfo) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const chatValue = useMemo(
    () => ({
      selectedChat,
      setSelectedChat,
      user,
      setUser,
      notification,
      setNotification,
      chats,
      setChats,
    }),
    [chats, notification, selectedChat, user]
  );

  return <ChatContext.Provider value={chatValue}>{children}</ChatContext.Provider>;
};
ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const ChatState = () => useContext(ChatContext);

export default ChatProvider;
