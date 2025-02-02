import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCy6grWhKCDSRh4f2wCe7XfgQU_a64aaD8",
  authDomain: "todolistproject-93307.firebaseapp.com",
  projectId: "todolistproject-93307",
  storageBucket: "todolistproject-93307.firebasestorage.app",
  messagingSenderId: "204448859875",
  appId: "1:204448859875:web:cd9a8a01513d74187427d6",
  databaseURL:
    "https://todolistproject-93307-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
export const tasks = getDatabase(app);
