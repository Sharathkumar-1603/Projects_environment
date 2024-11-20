// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnzwzQY5aN_rgGTGi_wWrthfY23XgZ0Ho",
  authDomain: "environment-sustainabili-2f9aa.firebaseapp.com",
  projectId: "environment-sustainabili-2f9aa",
  storageBucket: "environment-sustainabili-2f9aa.firebasestorage.app",
  messagingSenderId: "821249107322",
  appId: "1:821249107322:web:1617cd7a4eb3b4c63c22c3",
  measurementId: "G-KZW41HCT43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);