import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnll_gpEJJYXM9SF6E1RgDwdUp1oO9M4s",
  authDomain: "project63-33e66.firebaseapp.com",
  projectId: "project63-33e66",
  storageBucket: "project63-33e66.appspot.com",
  messagingSenderId: "910132595498",
  appId: "1:910132595498:web:2b5678949a580cdc46ac53",
  measurementId: "G-JS1NCES124"
};

export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);  