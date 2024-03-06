import { Helmet } from 'react-helmet-async';

import ChatView from 'src/sections/chat/chat-view';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title> Chats | Realax </title>
      </Helmet>

      <ChatView />
    </>
  );
}
