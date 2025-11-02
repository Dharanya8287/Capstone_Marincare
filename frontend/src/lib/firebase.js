// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// 👇 Force session-only persistence so closing the browser logs the user out
if (typeof window !== "undefined") {
    setPersistence(auth, browserSessionPersistence)
        .catch((err) => {
            // If this ever fails, you still get default persistence; log it for debugging.
            console.error("Failed to set Firebase session persistence:", err);
        });
}
