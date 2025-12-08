import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1fIXJSeZXkbVQ-kGNpnKiSLmbatO4bEU",
    authDomain: "adekis-plus.firebaseapp.com",
    projectId: "adekis-plus",
    storageBucket: "adekis-plus.firebasestorage.app",
    messagingSenderId: "1074109864320",
    appId: "1:1074109864320:web:881b91bd30e32b8a51c965"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
