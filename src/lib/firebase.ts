import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';

// Your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "terrasense-7c7d5.firebaseapp.com",
  projectId: "terrasense-7c7d5",
  storageBucket: "terrasense-7c7d5.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  databaseURL: "https://terrasense-7c7d5-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get reference to database
export const database = getDatabase(app);

// Export useful functions
export { ref, onValue, query, orderByChild, limitToLast };