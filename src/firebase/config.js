// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVWElzE7z9NI_tuXommmiGjPn5OzhKSL8",
    authDomain: "warehouse-management-e25fe.firebaseapp.com",
    projectId: "warehouse-management-e25fe",
    storageBucket: "warehouse-management-e25fe.appspot.com",
    messagingSenderId: "971186877423",
    appId: "1:971186877423:web:389c9169cda1262aa03c1a",
    measurementId: "G-J3XHZ3X4PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { analytics, app, auth, db, storage };

