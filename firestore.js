import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBv6UbWpSjHTu4XhLAAgkfLJtq3fHpeN8",
  authDomain: "project63-48da1.firebaseapp.com",
  projectId: "project63-48da1",
  storageBucket: "project63-48da1.appspot.com",
  messagingSenderId: "981567715976",
  appId: "1:981567715976:web:602a5e10f264d52f8fbd3d",
  measurementId: "G-BC9623LV1P"
};

export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);  