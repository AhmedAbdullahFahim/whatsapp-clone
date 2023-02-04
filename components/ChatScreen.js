import { createTheme, IconButton, ThemeProvider } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MicIcon from '@mui/icons-material/Mic'
import Moment from 'react-moment'
import styled from 'styled-components'
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { auth, db } from '@/firebase'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '@/utils/getRecipientEmail'

const ChatScreen = ({ chat, messages }) => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const endOfMessagesRef = useRef()
  const msgColRef = collection(db, `chats/${router.query.id}/messages`)
  const msgQuery = query(msgColRef, orderBy('timestamp', 'asc'))
  const [messagesSnapshot] = useCollection(msgQuery)
  const [message, setMessage] = useState('')

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else if (messages) {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()

    setDoc(
      doc(db, `users/${user.uid}`),
      {
        lastSeen: Timestamp.now(),
      },
      { merge: true }
    )

    addDoc(collection(db, 'chats', router.query.id, 'messages'), {
      message: message,
      timestamp: serverTimestamp(),
      user: user.email,
      photoURL: user.photoURL,
    })

    setMessage('')
    scrollToBottom()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      endOfMessagesRef.current.scrollIntoView({
        block: 'center',
        behaviour: 'smooth',
      })
    }, 50)
  }

  const recipientEmail = getRecipientEmail(chat.users, user)
  const recipientRef = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  )
  const [recipientSnapshot] = useCollection(recipientRef)
  const recipient = recipientSnapshot?.docs?.[0]?.data()

  const theme = createTheme({
    palette: {
      icon: {
        main: '#aebac1',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          {recipient ? (
            <Avatar src={recipient?.photoURL} />
          ) : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}
          <Info>
            <h3>{recipientEmail}</h3>
            {recipientSnapshot ? (
              <p>
                Last seen{' '}
                {recipient?.lastSeen?.toDate() ? (
                  <Moment fromNow>{recipient?.lastSeen?.toDate()}</Moment>
                ) : (
                  'unavailable'
                )}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </Info>
          <IconContainer>
            <IconButton>
              <SearchIcon color='icon' />
            </IconButton>
            <IconButton>
              <MoreVertIcon color='icon' style={{ marginLeft: '10px' }} />
            </IconButton>
          </IconContainer>
        </Header>
        <ChatContainer>
          {showMessages()}
          <EndofMessage ref={endOfMessagesRef} />
        </ChatContainer>
        <InputContainer>
          <InsertEmoticonIcon color='icon' style={{ marginRight: '15px' }} />
          <AttachFileIcon color='icon' />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message'
          />
          <MicIcon color='icon' />
          <button hidden disabled={!message} onClick={sendMessage} />
        </InputContainer>
      </Container>
    </ThemeProvider>
  )
}

export default ChatScreen

const Container = styled.div``

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #202c33;
  z-index: 100;
  padding: 10px 15px;
  height: 40px;
  align-items: center;
`
const Info = styled.div`
  margin-left: 15px;
  flex: 1;
  color: #d9dad0;

  > h3 {
    margin-bottom: -10px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`

const IconContainer = styled.div``

const ChatContainer = styled.div`
  padding: 30px;
  background-color: #111b21;
  min-height: 90vh;
`

const EndofMessage = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px 15px 16px 20px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: #202c33;
`

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: #384349;
  padding: 13px;
  margin-left: 15px;
  margin-right: 15px;
  color: white;
  font-size: 15px;
  ::placeholder {
    color: #aebac1;
  }
`
