import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDQnEbfeWM0MZyVLKUrRuAb0HEZBSUoQLo",
    authDomain: "findit-main.firebaseapp.com",
    projectId: "findit-main",
    storageBucket: "findit-main",
    messagingSenderId: "446374013487",
    appId: "1:446374013487:web:ea475a05845349b3d6b4da",
};

// Ensure Firebase is initialized only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
