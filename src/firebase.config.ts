// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH-J8M7ylfptetOma5PSHb8C9b6nG0dNo",
  authDomain: "hoabanmaiedu-23415.firebaseapp.com",
  projectId: "hoabanmaiedu-23415",
  storageBucket: "hoabanmaiedu-23415.firebasestorage.app",
  messagingSenderId: "953698484929",
  appId: "1:953698484929:web:a2a755f90af9f8d77f8a40",
  measurementId: "G-WJ8MJ6GHB3",
};
// setLogLevel("debug");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
export { auth, db };
