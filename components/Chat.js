import { auth, db } from '@/firebase'
import getRecipientEmail from '@/utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { closeDefault } from '@/features/default-page/defaultPageSlice'

const Chat = ({ id, users }) => {
  const dispatch = useDispatch()
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
    dispatch(closeDefault())
    router.push(`/chat/${id}`)
  }
  return (
    <Container onClick={goToChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`
