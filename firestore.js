import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmbxqYYrGVGPwMSNKltOFvJhB04HPj4HU",
  authDomain: "sut-group-b4294.firebaseapp.com",
  projectId: "sut-group-b4294",
  storageBucket: "sut-group-b4294.appspot.com",
  messagingSenderId: "1054999206798",
  appId: "1:1054999206798:web:6b0592d2a5a038aeeca2df"
};
// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export { firebase };