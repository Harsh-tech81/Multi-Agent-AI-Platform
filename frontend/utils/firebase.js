// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-a9a2f.firebaseapp.com",
  projectId: "cortexai-a9a2f",
  storageBucket: "cortexai-a9a2f.firebasestorage.app",
  messagingSenderId: "1088827955378",
  appId: "1:1088827955378:web:ce0187787e68650a3611ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider=new GoogleAuthProvider();



