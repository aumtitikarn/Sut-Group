import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2AdVVRm3CHrAOmjQn9rO-mL6SzvgR8uE",
  authDomain: "sut-group89.firebaseapp.com",
  projectId: "sut-group89",
  storageBucket: "sut-group89.appspot.com",
  messagingSenderId: "870612525828",
  appId: "1:870612525828:web:bd7d2200e24e6cb686e651",
  measurementId: "G-CG5THM5RS0"
};

export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);  