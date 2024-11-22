"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig"; // Make sure your Firebase config is correct
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/sidebar";

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true); // To handle the loading state while checking auth
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if no user is authenticated
        router.push("/");
      } else {
        setLoading(false); // If user is authenticated, stop loading
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#23262f]">
        <p className="text-[30px] text-[#fff] font-bold"> Please Wait...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3b3e46] h-screen p-[20px] flex">
      <Sidebar />
      <div className="ps-[20px] h-full w-[100%]">{children}</div>
    </div>
  );
};

export default Layout;
