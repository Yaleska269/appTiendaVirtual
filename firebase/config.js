import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const config = {
    apiKey: "AIzaSyA7S9eXN-9QToupjjlh7e1DBtE_Q_zw4AQ",
    authDomain: "tiendavirtual2-d3035.firebaseapp.com",
    projectId: "tiendavirtual2-d3035",
    storageBucket: "tiendavirtual2-d3035.firebasestorage.app",
    messagingSenderId: "65380936454",
    appId: "1:65380936454:web:87bc45ebf9b91ff7500c87",
};

const app = getApps().length > 0
    ? getApp()
    : initializeApp(config);

export const db = getFirestore(app);
export const auth = getAuth(app);
