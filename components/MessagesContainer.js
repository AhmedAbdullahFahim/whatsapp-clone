import React from 'react'
import styled from 'styled-components'

const MessagesContainer = ({ showMessages, endOfMessagesRef }) => {
  return (
    <Container>
      {showMessages()}
      <EndOfMessages ref={endOfMessagesRef} />
    </Container>
  )
}

export default MessagesContainer

const Container = styled.div`
  padding: 20px;
  background-color: #111b21;
  flex: 1;
  overflow-y: auto;
  background: url('/background.webp') no-repeat;
  background-size: cover;
  ::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: gray;
  }
`
const EndOfMessages = styled.div``
