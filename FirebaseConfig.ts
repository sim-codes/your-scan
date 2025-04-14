// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4xWUwPBQ3_UDD2bkEJq0S03HetZb-78k",
  authDomain: "your-scan.firebaseapp.com",
  projectId: "your-scan",
  storageBucket: "your-scan.firebasestorage.app",
  messagingSenderId: "878833699472",
  appId: "1:878833699472:web:80d6670e84d44c122e6615",
  measurementId: "G-JQ39N8WWLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app);
