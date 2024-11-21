import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime Database import

const firebaseConfig = {
  apiKey: "AIzaSyAjyF8FhSZBRycQV-AgIeuCsYHj-EDc7rY",
  authDomain: "nexchat-4edf3.firebaseapp.com",
  projectId: "nexchat-4edf3",
  storageBucket: "nexchat-4edf3.appspot.com",
  messagingSenderId: "305255911775",
  appId: "1:305255911775:web:d455d24e2ff534c934a6ea",
  measurementId: "G-H8VLWFMZGL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // Initialize Realtime Database

export { auth, db };
