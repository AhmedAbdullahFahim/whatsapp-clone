import { auth, db } from '@/firebase'
import getRecipientEmail from '@/utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import useMediaQuery from '@mui/material/useMediaQuery'

const Chat = ({ id, users }) => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const recipientEmail = getRecipientEmail(users, user)
  const recipientRef = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  )
  const [recipientSnapshot] = useCollection(recipientRef)
  const recipient = recipientSnapshot?.docs?.[0]?.data()

  const goToChat = () => {
    router.push(`/chat/${id}`)
  }
  return (
    <Container onClick={goToChat}>
      {recipient ? (
        <RecInfo>
          <UserAvatar src={recipient?.photoURL} />
          <Rec>
            <Contact>{recipient.username}</Contact>
            <RecEmail>{recipientEmail}</RecEmail>
          </Rec>
        </RecInfo>
      ) : (
        <>
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
          <Contact>{recipientEmail}</Contact>
        </>
      )}
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0.938rem;
  cursor: pointer;
  word-break: break-word;
  max-width: 92%;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  border-bottom: 1px solid #aebac130;
  :last-child {
    border-bottom: 0;
  }
  :hover {
    background-color: #202c33;
  }
`

const UserAvatar = styled(Avatar)`
  margin: 0.313rem;
  margin-right: 0.938rem;
`
const Contact = styled.p`
  color: #d9dad0;
`
const RecInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Rec = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const RecEmail = styled.span`
  font-size: 0.875rem;
  color: #d9dad090;
  margin-top: -0.938rem;
  margin-bottom: 0.625rem;
`
