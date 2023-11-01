import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp62C2lJL_Cy5S2-1GNS4R06424QywZcA",
  authDomain: "sutgroup54321.firebaseapp.com",
  projectId: "sutgroup54321",
  storageBucket: "sutgroup54321.appspot.com",
  messagingSenderId: "293882586570",
  appId: "1:293882586570:web:5d3171ba3b00cbebd8db33",
  measurementId: "G-HME783DHEH"
};

export const FIREBASE_APP = initializeApp(firebaseConfig) ;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP) ;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP) 
export const FIREBASE_STORAGE = getStorage(FIREBASE_STORAGE);  