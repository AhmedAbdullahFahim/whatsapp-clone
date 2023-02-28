// src = 'http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'

import { auth, provider } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import { Button, createTheme, ThemeProvider } from '@mui/material'
import Head from 'next/head'
import styled from 'styled-components'

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert)
  }

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
        <Head>
          <title>Login</title>
          <link rel='icon' href='/logo.webp' />
        </Head>
        <LoginContainer>
          <Logo src='logo.webp' />
          <LoginButton
            variant='contained'
            color='icon'
            onClick={() => signIn()}
          >
            Sign in with Google
          </LoginButton>
        </LoginContainer>
      </Container>
    </ThemeProvider>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6.25rem;
  background-color: #202c33;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 3.5rem;
`

const LoginButton = styled(Button)`
  color: #111b21;
`
