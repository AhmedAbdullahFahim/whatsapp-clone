import { auth } from '@/firebase'
import moment from 'moment'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

const Message = ({ message, user }) => {
  const [userLoggedIn] = useAuthState(auth)
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  )
}

export default Message

const Container = styled.div``

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
  @media (max-width: 780px) {
    font-size: 14px;
  }
`

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #005c4b;
`

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: #10161a;
`

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`
