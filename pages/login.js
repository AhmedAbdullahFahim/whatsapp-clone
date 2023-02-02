// src = 'http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'

import { auth, provider } from '@/firebase'
import { signInWithPopup } from 'firebase/auth'
import { Button } from '@mui/material'
import Head from 'next/head'
import styled from 'styled-components'

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert)
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png' />
        <Button variant='contained' color='inherit' onClick={() => signIn()}>
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
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
  padding: 100px;
  background-color: whitesmoke;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`
