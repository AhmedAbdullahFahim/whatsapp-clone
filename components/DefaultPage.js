import React from 'react'
import styled from 'styled-components'
import LockIcon from '@mui/icons-material/Lock'

const DefaultPage = () => {
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
}

export default DefaultPage

const DefaultContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
`

const Logo = styled.img`
  height: 150px;
`

const Title = styled.h1`
  margin-top: 40px;
  font-weight: 500;
`

const Description = styled.p`
  margin: 0;
  color: rgba(0, 0, 0, 0.7);
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
  text-align: flex-end;
  bottom: 0;
  position: absolute;
  margin-bottom: 20px;
`

const Ending = styled.p`
  margin-left: 5px;
`
