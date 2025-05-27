// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyACwyjgcMAVFmqRvCcbHSTDuIaq88-issA",
  authDomain: "xtremepay-7b1ab.firebaseapp.com",
  projectId: "xtremepay-7b1ab",
  storageBucket: "xtremepay-7b1ab.firebasestorage.app",
  messagingSenderId: "302827524987",
  appId: "1:302827524987:web:d923bd61081e17bfd463de"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
