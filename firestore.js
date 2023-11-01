import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmv-nA6FyGMuKq9jyucEIDNco_cm4WW1A",
  authDomain: "sut-group123.firebaseapp.com",
  databaseURL: "https://sut-group123-default-rtdb.firebaseio.com",
  projectId: "sut-group123",
  storageBucket: "sut-group123.appspot.com",
  messagingSenderId: "879415393779",
  appId: "1:879415393779:web:17c4bf6f0bc5ed312aa686",
  measurementId: "G-8NVY4871KT"
};

export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);  