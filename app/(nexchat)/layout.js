"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig"; // Ensure Firebase config is correct
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar";
import UserContext from "@/context/userContext";

const Layout = ({ children }) => {
  let { loggedInUser, setLoggedInUser, loading, setLoading } =
    useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#23262f]">
        <p className="text-[30px] text-[#fff] font-bold">Please Wait...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3b3e46] h-screen p-[20px] flex">
      <Sidebar userName={loggedInUser?.fullName} />
      <div className="ps-[20px] h-full w-[100%]">{children}</div>
    </div>
  );
};

export default Layout;
