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
import { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '@/utils/getRecipientEmail'
import MessagesContainer from './MessagesContainer'

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

  useEffect(() => {
    scrollToBottom()
  }, [chat])

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
            {recipient ? (
              <h3>{recipient?.username}</h3>
            ) : (
              <h3>{recipientEmail}</h3>
            )}
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
        <MessagesContainer
          showMessages={showMessages}
          endOfMessagesRef={endOfMessagesRef}
        />
        <InputContainer>
          <InsertEmoticonIcon
            color='icon'
            style={{ marginRight: '15px', cursor: 'pointer' }}
          />
          <AttachFileIcon color='icon' style={{ cursor: 'pointer' }} />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message'
          />
          <MicIcon color='icon' style={{ cursor: 'pointer' }} />
          <button hidden disabled={!message} onClick={sendMessage} />
        </InputContainer>
      </Container>
    </ThemeProvider>
  )
}

export default ChatScreen

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #202c33;
  z-index: 100;
  padding: 0.938rem;
  height: 2.5rem;
  align-items: center;
`
const Info = styled.div`
  margin-left: 0.938rem;
  flex: 1;
  color: #d9dad0;

  > h3 {
    margin-bottom: -0.625rem;
  }

  > p {
    font-size: 0.875rem;
    color: gray;
  }
`

const IconContainer = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 1rem 0.938rem 1rem 1.25rem;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: #202c33;
  border-bottom-right-radius: 5px;
`

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: #384349;
  padding: 0.813rem;
  margin-left: 0.938rem;
  margin-right: 0.938rem;
  color: white;
  font-size: 0.938rem;
  ::placeholder {
    color: #aebac1;
  }
`
