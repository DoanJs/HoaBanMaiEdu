import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// config for hoabanmaiedu-mobile
// const firebaseConfig = {
//   apiKey: "AIzaSyBneelps2P-qPFG5h3VSPYTwJRtx0u4n80",
//   authDomain: "hoabanmaiedu-mobile.firebaseapp.com",
//   projectId: "hoabanmaiedu-mobile",
//   storageBucket: "hoabanmaiedu-mobile.firebasestorage.app",
//   messagingSenderId: "465303174037",
//   appId: "1:465303174037:web:c9ab7e49f2105a5a86149c",
//   measurementId: "G-P113B6FJ95"
// };

// config for hoabanmaiedu
const firebaseConfig = {
  apiKey: "AIzaSyAH-J8M7ylfptetOma5PSHb8C9b6nG0dNo",
  authDomain: "hoabanmaiedu-23415.firebaseapp.com",
  projectId: "hoabanmaiedu-23415",
  storageBucket: "hoabanmaiedu-23415.firebasestorage.app",
  messagingSenderId: "953698484929",
  appId: "1:953698484929:web:a2a755f90af9f8d77f8a40",
  measurementId: "G-WJ8MJ6GHB3"
};

// setLogLevel("debug");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, "asia-southeast1");
// const analytics = getAnalytics(app);
export { auth, db, functions };
