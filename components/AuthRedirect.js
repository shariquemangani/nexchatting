"use client";
// components/AuthRedirect.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebaseConfig"; // Your Firebase config file

const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Listen to auth state change
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("user", user);
      if (!user) {
        // If no user is logged in, redirect to the /auth page
        router.push("/auth");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [router]);

  return null; // This component just handles redirection, doesn't render anything
};

export default AuthRedirect;
