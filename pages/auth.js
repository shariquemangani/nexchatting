"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { ref, set } from "firebase/database";
import { setCookie } from "cookies-next";

const Auth = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignUp && !displayName)) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const register = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(register.user, {
          displayName: displayName,
        });

        await set(ref(db, "users/" + register.user.uid), {
          phoneNumber: number,
          email: email,
        });

        console.log("User registered:", register);

        setCookie("isLoggedIn", "true", { maxAge: 60 * 60 * 24 * 7 });

        router.push("/chats");
      } else {
        const sign = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", sign.user);

        setCookie("isLoggedIn", "true", { maxAge: 60 * 60 * 24 * 7 });

        router.push("/chats");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error during authentication:", error.message);

      const errorMessages = {
        "auth/invalid-email": "Please enter a valid email.",
        "auth/user-disabled": "Your account has been disabled.",
        "auth/user-not-found": "No user found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "This email is already registered.",
      };

      setError(
        errorMessages[error.code] || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-[35px] font-semibold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mb-4 p-2 w-full border rounded-md"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        />
        {isSignUp && (
          <input
            type="number"
            placeholder="Phone Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="mb-4 p-2 w-full border rounded-md"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        />
        <button
          type="submit"
          className="w-full p-2 h-[40px] bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="sm" color="white" />
            </div>
          ) : isSignUp ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-blue-500"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Auth;
