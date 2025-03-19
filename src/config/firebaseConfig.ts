// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6W_P-WxKIMSomm0W3UuL7W0r2uodRRTo",
  authDomain: "swd392-3203c.firebaseapp.com",
  projectId: "swd392-3203c",
  storageBucket: "swd392-3203c.appspot.com",
  messagingSenderId: "46151118776",
  appId: "1:46151118776:web:297efcbdde2bfc4b8f694d",
  measurementId: "G-K0V44TK4DP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { auth, storage, analytics, firestore, ref, uploadBytes, getDownloadURL };