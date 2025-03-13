import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDQnEbfeWM0MZyVLKUrRuAb0HEZBSUoQLo",
    authDomain: "findit-main.firebaseapp.com",
    projectId: "findit-main",
    storageBucket: "findit-main.appspot.com",
    messagingSenderId: "446374013487",
    appId: "1:446374013487:web:ea475a05845349b3d6b4da",
};

// Ensure Firebase is initialized only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
