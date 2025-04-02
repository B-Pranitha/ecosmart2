// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdgnpxd3ZsLUn0Cvwc1MkYFuhfYBpID1I",
  authDomain: "ecosmart-54ac6.firebaseapp.com",
  databaseURL: "https://ecosmart-54ac6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecosmart-54ac6",
  storageBucket: "ecosmart-54ac6.firebasestorage.app",
  messagingSenderId: "834837781787",
  appId: "1:834837781787:web:e07308f1c887beab7b87be",
  measurementId: "G-HE4FYZCJGB"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };