import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import getTimeDifference from 'src/utils/functions';

export default function ChatList({ chats, loadingChats, id }) {
  return (
    <>
    
    <List
      sx={{
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {loadingChats ? ( // Show loader if loading chats
        <CircularProgress sx={{ alignSelf: 'center', mt: 2 }} />
      ) : (
        <>
          {chats?.length === 0 ? (
            <ListItemText primary={'No Chats Available'} />
          ) : (
            <>
              {chats?.map((chat, ind) => (
                <ListItem
                  key={ind}
                  sx={{
                    textAlign: id === chat?.sender?._id ? 'right' : 'left',
                    marginBottom: '2px',
                  }}
                >
                  <ListItemAvatar
                    sx={{ order: id === chat?.sender?._id ? '1' : '0', minWidth: '0' }}
                  >
                    <Avatar alt={chat?.sender?.username} src={chat?.sender?.avatar} />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      chat?.content || (chat?.attachments?.length > 0 ? chat?.attachments?.url : '')
                    }
                      secondary={getTimeDifference(chat?.createdAt)}
                    sx={{
                      width: 'fit-content',
                      borderRadius: '10px',
                      padding: '8px',
                    }}
                  />
                  {chat.attachments?.length > 0 && (
                    <img src={chat.attachments?.localPath} alt="Attachment" />
                  )}
                </ListItem>
              ))}
            </>
          )}
        </>
      )}
    </List>
   
    </>
  );
}
