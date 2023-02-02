import { IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
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
  console.log(recipient?.lastSeen?.toDate())

  return (
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
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconContainer>
      </Header>
      <ChatContainer>
        {showMessages()}
        <EndofMessage ref={endOfMessagesRef} />
      </ChatContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <MicIcon />
        <button hidden disabled={!message} onClick={sendMessage} />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div``

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`
const Info = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`

const IconContainer = styled.div``

const ChatContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`

const EndofMessage = styled.div``

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: white;
`

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`
