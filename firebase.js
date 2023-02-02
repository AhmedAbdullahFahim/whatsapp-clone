import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC_cbGp067pXYwrNp23Fr7nQWR4K8zQoYk',
  authDomain: 'whatsapp-clone-a36e1.firebaseapp.com',
  projectId: 'whatsapp-clone-a36e1',
  storageBucket: 'whatsapp-clone-a36e1.appspot.com',
  messagingSenderId: '279224686850',
  appId: '1:279224686850:web:b43105927edcde958dca1b',
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }
