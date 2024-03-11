import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7qVi9yI_k64eBblngJ54v-p3RQ7MAY0s",
  authDomain: "chronos-c2cfd.firebaseapp.com",
  projectId: "chronos-c2cfd",
  storageBucket: "chronos-c2cfd.appspot.com",
  messagingSenderId: "906292532193",
  appId: "1:906292532193:web:96f166d687d48d2390b8a0",
  measurementId: "G-C49RWDPHGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GithubAuthProvider();

// Export the provider for GitHub authentication
export { auth, db, provider };