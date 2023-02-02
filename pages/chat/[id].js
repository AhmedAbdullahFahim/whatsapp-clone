import ChatScreen from '@/components/ChatScreen'
import Sidebar from '@/components/Sidebar'
import { auth, db } from '@/firebase'
import getRecipientEmail from '@/utils/getRecipientEmail'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth)
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

export const getServerSideProps = async (context) => {
  // reference to the document of this specific chat
  const docRef = doc(db, `chats/${context.query.id}`)

  // reference to the collection of messages of this chat
  const msgColRef = collection(db, `chats/${context.query.id}/messages`)

  // preparing the messages
  // querying the messages collection
  const msgQuery = query(msgColRef, orderBy('timestamp', 'asc'))
  const messagesRes = await getDocs(msgQuery)
  // adjusting the messages array to get it in a proper way
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    // whenever we send firestore data from backend to frontend the timestamp gets deleted
    .map((msgs) => ({
      ...msgs,
      timestamp: msgs.timestamp.toDate().getTime(),
    }))

  //preparing the chat
  // getting the document we just referred to
  const chatRes = await getDoc(docRef)
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  }
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  }
}

const Container = styled.div`
  display: flex;
`

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`
