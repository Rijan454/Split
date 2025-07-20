// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Simpler import
import { getFirestore } from "firebase/firestore";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCjMK74GCO6sFaI0z5d8gR9ubm2p7PUj0M",
  authDomain: "split-3579d.firebaseapp.com",
  projectId: "split-3579d",
  storageBucket: "split-3579d.appspot.com",
  messagingSenderId: "960297661012",
  appId: "1:960297661012:web:6858845e9ac9f4ab7c49cd",
  measurementId: "G-FBX7N4NR2K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth (no persistence)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);



export { auth, db };
