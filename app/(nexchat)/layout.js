"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Sidebar from "@/components/sidebar";
import UserContext from "@/context/userContext";
import {
  off,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

const Layout = ({ children }) => {
  const {
    loggedInUser,
    setLoggedInUser,
    loading,
    setLoading,
    setLogOutLoader,
    users,
    setUsers,
  } = useContext(UserContext);

  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLogOutLoader(true);
    try {
      if (currentUser) {
        await updateUserStatus(currentUser.displayName, "offline");
      }
      await signOut(auth);
      document.cookie =
        "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogOutLoader(false);
    }
  };

  const updateUserStatus = async (name, state) => {
    if (!name) return;
    try {
      const userStatusRef = ref(db, `status/${name}`);
      await set(userStatusRef, {
        state,
        lastChanged: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        updateUserStatus(user.displayName, "online");
      } else {
        setCurrentUser(null);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (currentUser) {
      const userStatusRef = ref(db, `status/${currentUser.displayName}`);
      const connectedRef = ref(db, ".info/connected");

      const handleConnectedStatus = (snapshot) => {
        const isOnline = {
          state: "online",
          lastChanged: serverTimestamp(),
        };

        const isOffline = {
          state: "offline",
          lastChanged: serverTimestamp(),
        };

        if (snapshot.val() === true) {
          set(userStatusRef, isOnline);
          onDisconnect(userStatusRef).set(isOffline);
        } else {
          set(userStatusRef, isOffline);
        }
      };

      onValue(connectedRef, handleConnectedStatus);

      return () => {
        off(connectedRef, "value", handleConnectedStatus);
        set(userStatusRef, {
          state: "offline",
          lastChanged: serverTimestamp(),
        });
      };
    }
  }, [currentUser]);

  useEffect(() => {
    const usersRef = ref(db, "status");
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data || []);
    });

    return () => unsubscribeUsers();
  }, [setUsers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#23262f]">
        <p className="text-[30px] text-[#fff] font-bold">Please Wait...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#3b3e46] h-screen p-[20px] flex">
      <Sidebar userName={loggedInUser?.fullName} onLogout={handleLogout} />
      <div className="ps-[20px] h-full w-[100%]">{children}</div>
    </div>
  );
};

export default Layout;
