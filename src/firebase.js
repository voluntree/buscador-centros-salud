// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbTf8rZKDTn2VtQCmErzrnTQAtK4ChLUM",
  authDomain: "iei-practicas.firebaseapp.com",
  databaseURL: "https://iei-practicas-default-rtdb.firebaseio.com",
  projectId: "iei-practicas",
  storageBucket: "iei-practicas.appspot.com",
  messagingSenderId: "391878724216",
  appId: "1:391878724216:web:57102993352c02d9bafb8d",
  measurementId: "G-1Z6MRVEG31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export {db}