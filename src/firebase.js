import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyB7RNccQXK57VzRJVI1OPvj9XiMez6cAhY',
  authDomain: 'alias-38a2a.firebaseapp.com',
  databaseURL:
    'https://alias-38a2a-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'alias-38a2a',
  storageBucket: 'alias-38a2a.appspot.com',
  messagingSenderId: '695455428559',
  appId: '1:695455428559:web:65831a98650a8ad5ceecba',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
