import React from 'react'
import styled from 'styled-components'
import LockIcon from '@mui/icons-material/Lock'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/router'

const DefaultPage = () => {
  const [user] = useAuthState(auth)
  const matches = useMediaQuery('(max-width:780px)')
  const router = useRouter()

  if (!matches) {
    return (
      <DefaultContainer>
        <Logo src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' />
        <Title>WhatsApp Web</Title>
        <Description>
          Send and recieve messages without keeping your phone online.
        </Description>
        <Description>
          Use WhatsApp on up to 4 linked devices and one phone at the same time.
        </Description>
        <Footer>
          <LockIcon fontSize='inherit' />
          <Ending>End-to-end encrypted</Ending>
        </Footer>
      </DefaultContainer>
    )
  } else {
    return (
      <DefaultContainer>
        <Header>
          <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
          <Name>{user.displayName}</Name>
        </Header>
        <Main>
          <Logo src='/logo.webp' />
          <Title>WhatsApp Web</Title>
          <Description>
            Send and recieve messages without keeping your phone online.
          </Description>
          <Description>
            Use WhatsApp on up to 4 linked devices and one phone at the same
            time.
          </Description>
          <DefaultButton
            onClick={() =>
              router.push({ pathname: '/', query: { fillScreen: true } })
            }
          >
            Show Chats
          </DefaultButton>
        </Main>
        <Footer>
          <LockIcon fontSize='inherit' />
          <Ending>End-to-end encrypted</Ending>
        </Footer>
      </DefaultContainer>
    )
  }
}

export default DefaultPage

const DefaultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #222e35;
  height: 100vh;
  flex: 1;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-top: 2rem;
`

const UserAvatar = styled(Avatar)`
  margin-right: 0.6rem;
`

const Name = styled.p`
  color: #c9cec5;
  font-weight: 500;
  font-size: 1.3rem;
`

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7rem;
`

const DefaultButton = styled(Button)`
  width: 50%;
  color: #202c33;
  background-color: #aebac1;
  margin-top: 3rem;
  font-weight: bold;
`

const Logo = styled.img`
  height: 150px;
`

const Title = styled.h1`
  margin-top: 2.5rem;
  font-weight: 500;
  color: #c9cec5;
`

const Description = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.5);
  @media (max-width: 780px) {
    padding: 0 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.35);
  text-align: flex-end;
  bottom: 0;
  position: absolute;
  margin-bottom: 1.25rem;
`

const Ending = styled.p`
  margin-left: 0.313rem;
`
