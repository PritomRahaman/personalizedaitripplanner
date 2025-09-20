// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child, update } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH0NGItV2KIsKh1qzeddJYe--XaTBFaY4",
  authDomain: "ai-trip-planner-4691b.firebaseapp.com",
  projectId: "ai-trip-planner-4691b",
  storageBucket: "ai-trip-planner-4691b.firebasestorage.app",
  messagingSenderId: "68147169870",
  appId: "1:68147169870:web:ae53a71e9b118dc39d111f",
  databaseURL:"https://ai-trip-planner-4691b-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, set, get, child, update };