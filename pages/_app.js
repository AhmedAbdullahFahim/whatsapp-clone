import Loading from '@/components/Loading'
import { auth, db } from '@/firebase'
import '@/styles/globals.css'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login'
import { Provider } from 'react-redux'
import { store } from '@/store'

export default function App({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          username: user.displayName,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      )
    }
  }, [user])

  if (loading) return <Loading />

  if (!user) return <Login />
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
