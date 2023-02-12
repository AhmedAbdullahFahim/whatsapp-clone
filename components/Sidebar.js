import { Button, createTheme, IconButton, ThemeProvider } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GroupsIcon from '@mui/icons-material/Groups'
import SearchIcon from '@mui/icons-material/Search'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import FilterListIcon from '@mui/icons-material/FilterList'
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

  const theme = createTheme({
    palette: {
      icon: {
        main: '#aebac1',
      },
    },
  })
  let isMobile = window.matchMedia(
    'only screen and (max-width: 1024px)'
  ).matches

  console.log(isMobile)

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
          <IconContainer>
            <Icon>
              <GroupsIcon color='icon' />
            </Icon>
            <Icon>
              <DonutLargeIcon
                color='icon'
                style={{ transform: 'rotate(75deg)' }}
              />
            </Icon>
            <Icon>
              <ChatIcon color='icon' fontSize='small' />
            </Icon>
            <Icon>
              <MoreVertIcon color='icon' />
            </Icon>
          </IconContainer>
        </Header>
        <SearchContainer>
          <Search>
            <SearchIcon color='icon' fontSize='small' />
            <SearchInput placeholder='Search or start new chat' />
          </Search>
          <FilterListIcon color='icon' fontSize='small' />
        </SearchContainer>
        <SidebarButton onClick={startChat}>Start a new chat</SidebarButton>
        {chatsSnapshot?.docs.map((chat, index) => (
          <Chat key={chat.id} users={chat.data().users} id={chat.id} />
        ))}
      </Container>
    </ThemeProvider>
  )
}

export default Sidebar

const Container = styled.div`
  flex: 0.45;
  height: 100vh;
  max-width: 28.125rem;
  overflow-y: scroll;
  background-color: #111b21;
  border-right: 1px solid #aebac130;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.938rem;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #202c33;
  align-items: center;
  height: 2.5rem;
`

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const IconContainer = styled.div``

const Icon = styled(IconButton)`
  margin-right: 0.625rem;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.625rem;
  border-radius: 2px;
  justify-content: space-evenly;
`

const Search = styled.div`
  background-color: #202c33;
  flex: 0.97;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 0.5rem 0.313rem 0.5rem 0.938rem;
  margin-right: 0.125rem;
`

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  background-color: #202c33;
  color: #aebac1;
  padding-left: 2.5rem;
  ::placeholder {
    color: #aebac1;
  }
`

const SidebarButton = styled(Button)`
  width: 100%;
  color: #aebac1;
  background-color: #202c33;
  max-width: 99%;
  margin-bottom: 0.625rem;
`
