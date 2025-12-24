// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXyNxA-mfBdLmdwuCutzBs24uUtdNIdjU",
    authDomain: "gullypg.firebaseapp.com",
    projectId: "gullypg",
    storageBucket: "gullypg.firebasestorage.app",
    messagingSenderId: "898929411770",
    appId: "1:898929411770:web:77bf72c5212435bc902483",
    measurementId: "G-KE1EBHCGJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
