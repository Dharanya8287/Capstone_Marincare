useAuth.js;
import { auth } from "@/lib/firebase";
import axios from "axios";
import {
<<<<<<< HEAD
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
=======
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
>>>>>>> origin/main
} from "firebase/auth";

// Hook provides functions to perform authentication actions.
export default function useAuth() {
  const login = async (email, password) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCred.user.getIdToken(true);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
      idToken,
    });
  };

<<<<<<< HEAD
    const login = async (email, password) => {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    };

    const signup = async (email, password) => {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCred.user.getIdToken(true);
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
    };

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        // Await the result from the popup window
        const result = await signInWithPopup(auth, provider);

        // If the popup is successful, get the token and sync with the backend
        if (result.user) {
            const idToken = await result.user.getIdToken(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, { idToken });
        }
    };
=======
  const signup = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCred.user.getIdToken(true);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
      idToken,
    });
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    // Await the result from the popup window
    const result = await signInWithPopup(auth, provider);

    // If the popup is successful, get the token and sync with the backend
    if (result.user) {
      const idToken = await result.user.getIdToken(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
        idToken,
      });
    }
  };
>>>>>>> origin/main

  const logout = async () => {
    await signOut(auth);
  };

  return { login, signup, googleLogin, logout };
}
