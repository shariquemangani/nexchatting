"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

const Auth = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

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

        console.log("User registered:", register);
      } else {
        const sign = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", sign.user);
        setLoading(false);
      }

      setLoading(false);
      router.push("/chat");
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
        <input
          type="text"
          placeholder="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        />
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
        {error && <p className="text-red-500 mt-4">{error}</p>}{" "}
        {/* Display error message */}
      </form>
    </div>
  );
};

export default Auth;
