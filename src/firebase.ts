/*----*/

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVldFWonbqh5AKDaZAp652UFY2GTzzIbA",
  authDomain: "menu-fries-station.firebaseapp.com",
  databaseURL: "https://menu-fries-station-default-rtdb.firebaseio.com",
  projectId: "menu-fries-station",
  storageBucket: "menu-fries-station.firebasestorage.app",
  messagingSenderId: "300531884553",
  appId: "1:300531884553:web:8422d1d40e591d032c4ed8"
};

const app = initializeApp(firebaseConfig);

// 👇 هذا هو المهم
export const db = getDatabase(app);
export const auth = getAuth(app);
