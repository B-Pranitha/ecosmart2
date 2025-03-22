// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyApCCW-q-Q6lU-Goz_SQ3nIexFQP5x1ecA",
  authDomain: "ecosmart-7473c.firebaseapp.com",
  databaseURL: "https://ecosmart-7473c-default-rtdb.firebaseio.com",
  projectId: "ecosmart-7473c",
  storageBucket: "ecosmart-7473c.firebasestorage.app",
  messagingSenderId: "589844559688",
  appId: "1:589844559688:web:5af1a7ffa7edce56e9a57d",
  measurementId: "G-TVQK3GYG77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };