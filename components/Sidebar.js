import { Button, IconButton } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import * as EmailValidator from 'email-validator'
import { auth, db } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, query, where } from 'firebase/firestore'
import Chat from './Chat'

const Sidebar = () => {
  const [user] = useAuthState(auth)
  const usersRef = query(
    collection(db, 'chats'),
    where('users', 'array-contains', user.email)
  )
  const [chatsSnapshot] = useCollection(usersRef)

  const startChat = () => {
    const input = prompt(
      'Please enter an email address for the user you wish to chat with'
    )

    if (!input) return

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      addDoc(collection(db, 'chats'), {
        users: [user.email, input],
      })
    }
  }

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )

  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
        <IconContainer>
          <Icon>
            <ChatIcon />
          </Icon>
          <Icon>
            <MoreVertIcon />
          </Icon>
        </IconContainer>
      </Header>
      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder='Search in chats' />
      </SearchContainer>
      <SidebarButton onClick={startChat}>Start a new chat</SidebarButton>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} users={chat.data().users} id={chat.id} />
      ))}
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  border-right: 1px solid whitesmoke;
  flex: 0.45;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 11px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const IconContainer = styled.div``

const Icon = styled(IconButton)``

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`

const SidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  color: black;
`
