import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
// import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar, Button, ListItemAvatar, TextField } from '@mui/material';
import { useAuth } from 'src/contexts/auth-context';
import ChatList from './chat-list';

const drawerWidth = 240;

export default function ChatView(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [message, setMessage] = React.useState({
    content:"",
  });

  const [loadingChats, setLoadingChats] = React.useState(false);
  const [currentChat, setCurrentChat] = React.useState({
    chatID: 1,
    userid: '1',
    name: 'Start a Chat',
    avatar: null,
  });
  const {
    getAllAvailableUsers,
    chatUsers,
    getAllSingleUserChats,
    chats,
    setChats,
    sendMessageinChat,
    initializeSocket,
  } = useAuth();
  const myid = localStorage.getItem('userID');
  React.useEffect(() => {
    getAllAvailableUsers();
  }, [chats]);
  React.useEffect(() => {
    initializeSocket();
  }, []);
  React.useEffect(() => {
    getAllSingleUserChats(currentChat.chatID);
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const handleUserClick = async (user) => {
    console.log(user);
    setCurrentChat({
      chatID: user._id,
      userid:
        user.participants[0]?._id === myid ? user.participants[1]?._id : user?.participants[0]?._id,
      name:
        user.participants[0]?._id === myid
          ? user.participants[1]?.username
          : user?.participants[0]?.username,
      avatar:
        user.participants[0]?._id === myid
          ? user.participants[1]?.avatar
          : user?.participants[0]?.avatar,
    });
    setLoadingChats(true);
    try {
      await getAllSingleUserChats(currentChat.chatID);
      console.log(chats);
      setLoadingChats(false);
    } catch (error) {
      console.log(error);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List sx={{ borderRadius: '10px', position: 'relative' }}>
        {chatUsers
          ?.filter((user) => !user.isGroupChat)
          .map((user) => (
            <ListItem key={user.participants[0]?._id} button onClick={() => handleUserClick(user)}>
              <ListItemAvatar>
                <Avatar
                  alt={
                    user.participants[0]?._id === myid
                      ? user.participants[1]?.username
                      : user.username
                  }
                  src={user.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  user.participants[0]?._id === myid
                    ? user.participants[1]?.username
                    : user?.participants[0]?.username
                }
                secondary={user.lastActive}
              />
            </ListItem>
          ))}
      </List>
      <Divider />
      <List sx={{ borderRadius: '10px' }}>
        {chatUsers
          ?.filter((user) => !user.isGroupChat)
          .map((user) => (
            <ListItem key={user.participants[0]?._id} button onClick={() => handleUserClick(user)}>
              <ListItemAvatar>
                <Avatar
                  alt={
                    user.participants[0]?._id === myid
                      ? user.participants[1]?.username
                      : user.username
                  }
                  src={user.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  user.participants[0]?._id === myid
                    ? user.participants[1]?.username
                    : user?.participants[0]?.username
                }
                secondary={user.lastActive}
              />
            </ListItem>
          ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;
  const handleMessageChange = (event) => {
    setMessage({ ...message, content: event.target.value });
  };
  
  console.log(chats && chats.length)
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageContent = message.content || ''; // Ensure content is not empty
  
      const newMessage = {
        content: messageContent,
        sender: myid, // Assuming you store the user ID in localStorage
        chat: currentChat.chatID,
        attachments: [], // Assuming you don't have attachments for now
      };
      console.log(newMessage)
  
      await sendMessageinChat(currentChat.chatID, newMessage, e);
      
      // await setChats((prevChats) => {
      //   const updatedChats = prevChats.map((chat) => {
      //     if (chat._id === currentChat.chatID) {
      //       // If this is the current chat, add the new message
      //       console.log(chat)
      //       return {
      //         ...chat,
      //         messages: [...chat.messages, newMessage],
            
      //       };
      //     }
      //     return chat;
      //   });
      //   return updatedChats;
      // });

      setChats((prevChats) => [...prevChats, newMessage]);
      
      console.log('Message sent through socket:', newMessage);
      console.log(chats);
      
      setMessage({ content: '' }); // Reset message content
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '76vh',
        width: '100%',
        backgroundColor: '#f6f6f6',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <CssBaseline />

      <AppBar
        position="absolute"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <Avatar alt={currentChat.name} src={currentChat.avatar} />
            {currentChat.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, position: 'static' }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            position: 'absolute', // Change position to static
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              position: 'absolute',
            },
            // Change position to static
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        <Toolbar />
        <Box>
          <ChatList chats={chats} loadingChats={loadingChats} id={myid} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 1,
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: '0',
          right: '0',
          left: '0',
          zIndex: '9999',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          value={message.content}
          onChange={handleMessageChange}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ marginLeft: 1 }} // Add some margin to separate the button from the text field
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

ChatView.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};
