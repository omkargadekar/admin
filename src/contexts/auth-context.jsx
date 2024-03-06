import axios from 'axios';
import PropTypes from 'prop-types';
import { useMemo, useState, useContext, createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chatUsers , setChatUsers] = useState(null)
  const [chats , setChats] = useState(null)
  const [message , setMessage] = useState(null)
  const [customers, setCustomers] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const API = 'https://chatsapp-nw05.onrender.com/api/v1';
  const [socket , setSocket] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      // Fetch customers only when accessToken is available
      // getAllCustomers();
    }
  }, [accessToken]);


  useEffect(()=>{

  })

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data.user);
        localStorage.setItem('accessToken', userData.data.accessToken);
        localStorage.setItem('userID', userData.data.user._id);
        localStorage.setItem('user', JSON.stringify(userData.data.user));
        setAccessToken(userData.data.accessToken);
        getAllCustomers();
        return userData;
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(`${API}/users/logout`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      setUser(null);
      setCustomers(null); // Reset customers on logout
      return res;
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const getAllCustomers = async () => {
    try {
      const res = await axios.get(`${API}/chat-app/chats/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCustomers(res.data.data);
      return res;
    } catch (error) {
      console.error('Error fetching all customers:', error, accessToken);
      // Ensure a value is always returned, even in the error case
      return null;
    }
  };

  const getAllAvailableUsers = async () => {
    try {
      // const accessToken = window.sessionStorage.getItem("accessToken");
      const res = await axios.get(`${API}/chat-app/chats/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setChatUsers(res.data.data);
      return chatUsers
    } catch (error) {
      console.error('Error fetching all chatusers:', error);
    }
  };

  function initializeSocket(){
    const newSocket = io('https://chatsapp-nw05.onrender.com', {
      headers: {
        auth: {accessToken},
        withCredentials: true,
      },
    });

    newSocket.on("connect", () => {
      console.log('Connected to socket server');
    });

    newSocket.on('messageReceived', (data) => {
      console.log("Message received:", data);
      setChats((pre) => [...pre, data]);
    });

    setSocket(newSocket);
  };

  const getAllSingleUserChats = async (chatId) => {
    try {
      // Use a simple request (GET) without additional headers that might trigger OPTIONS requests
     
      const res = await axios.get(`${API}/chat-app/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // const singleUserChats = res.data.data;
      socket.on("messageReceived", (data) => {
        console.log("Message received:", data);
        setChats((chats) => [...chats, data]);
      });
      setChats(res.data.data);
      return chats;
     
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };



  const sendMessageinChat = async (chat, content, e) => {
    console.log(content)
    e.preventDefault();
    try {
      // const socket = socketInitializer()
      // socket.emit("sendMessage", { chat, message: content });
  
      // Make the Axios request to save the message
      console.log(chat , content)
      socket.emit('joinChat', { chat, content });

      const res = await axios.post(
        `${API}/chat-app/messages/${chat}`,
         content ,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      socket.on("messageReceived", (data) => {
        console.log("Message received:", data);
      });
      setChats((prev) => [content, ...prev]);
        
      // return res.data.data
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error appropriately
    }
  };
  

  const authValue = useMemo(
    () => ({
      login,
      logout,
      getAllCustomers,
      getAllAvailableUsers,
      getAllSingleUserChats,
      sendMessageinChat,
      initializeSocket,
      user,
      customers,
      chatUsers,
      chats,
      setChats,
    }),
    // []
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => useContext(AuthContext);
