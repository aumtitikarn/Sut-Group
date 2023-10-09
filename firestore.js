import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmbxqYYrGVGPwMSNKltOFvJhB04HPj4HU",
  authDomain: "sut-group-b4294.firebaseapp.com",
  projectId: "sut-group-b4294",
  storageBucket: "sut-group-b4294.appspot.com",
  messagingSenderId: "1054999206798",
  appId: "1:1054999206798:web:6b0592d2a5a038aeeca2df"
};
export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);