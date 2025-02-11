// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2P695koTkrdM4f0d71e5_kyovUtWJH_k",
  authDomain: "managerpost-eb04e.firebaseapp.com",
  projectId: "managerpost-eb04e",
  storageBucket: "managerpost-eb04e.appspot.com",
  messagingSenderId: "1040324841373",
  appId: "1:1040324841373:web:83d445def2142931322974",
  measurementId: "G-DC26S31889"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { auth, storage, analytics, firestore, ref, uploadBytes, getDownloadURL };