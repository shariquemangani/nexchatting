"use client";

import { sidebarData } from "@/utils/sidebarData";
import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logout from "@/public/icons/logout.svg";
import leftArrow from "@/public/icons/leftArrow.svg";
import user from "@/public/icons/user.svg";

import React, { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

const Sidebar = ({ userName }) => {
  const [sideOpen, setSideOpen] = useState(true);
  const [logOutLoader, setLogOutLoader] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setLogOutLoader(true);
    setTimeout(async () => {
      try {
        await signOut(auth);
        document.cookie =
          "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
        setLogOutLoader(false);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }, 1000);
  };

  return (
    <div
      className={`${
        sideOpen && sideOpen
          ? "min-w-[200px] w-[200px]"
          : "min-w-[30px] w-[62px]"
      } h-full bg-[#23262f] rounded-[20px] py-[20px]  text-[white] flex flex-col justify-between [transition:0.5s] relative animate__animated  animate__fadeIn`}
    >
      <Button
        className="min-w-[25px] w-[25px] h-[25px] rounded-[8px] p-0 bg-[#54565d] absolute bottom-[100px] right-[-10px] [box-shadow:0px_0px_10px_0px_#272727]"
        onClick={() => setSideOpen(!sideOpen)}
      >
        <Image
          src={leftArrow}
          height={100}
          width={17}
          alt="Left arrow"
          className={`[transition:0.5s] ${
            sideOpen && sideOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </Button>
      <div className="flex flex-col gap-[20px]">
        <div className="px-[15px] flex items-center gap-[10px] overflow-hidden">
          <Image
            src={user}
            width={20}
            height={10}
            alt="Profile"
            className="min-w-[30px] w-[30px] h-[30px] p-[5px] rounded-[50%] border-[1px] border-[#ddd]"
          />
          {/* {sideOpen && ( */}
          <p
            className={`text-[15px] min-w-[100px] ${
              sideOpen && sideOpen
                ? "animate__fadeInRight"
                : "animate__fadeOutRight"
            } animate__animated animate__faster `}
          >
            {userName}
          </p>
          {/* )} */}
        </div>
        <div className="flex flex-col gap-[10px]">
          {sidebarData.map((e, i) => {
            return (
              <div
                className="w-full flex items-center relative overflow-hidden px-[5px]"
                key={i + 1}
              >
                <p
                  className={`absolute h-[80%] w-[7px] bg-white rounded-e-[5px] left-[0px] animate__animated animate__faster  ${
                    pathName === e.path
                      ? " animate__fadeInLeft"
                      : " animate__fadeOutLeft"
                  }`}
                ></p>
                <Button
                  className="w-full bg-transparent hover:bg-[#a0a0a020] text-[#fff] flex items-center justify-start gap-[15px] min-w-[10px]"
                  onClick={() => router.push(e.path)}
                >
                  <Image src={e.icon} alt="Chat" width={17} height={100} />{" "}
                  <p
                    className={`text-[15px] ${
                      sideOpen && sideOpen
                        ? "animate__fadeInRight"
                        : "animate__fadeOutRight"
                    } animate__animated animate__faster `}
                  >
                    {e.name}
                  </p>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="px-[5px]">
        <Button
          className="w-full bg-transparent hover:bg-[#a0a0a020] text-[#fff] flex items-center justify-start gap-[15px] min-w-[10px]"
          onClick={() => handleLogout()}
        >
          <span className="w-[20px] flex items-center justify-center">
            {logOutLoader ? (
              <Spinner size="sm" color="white" className="w-[17px]" />
            ) : (
              <Image
                src={logout}
                alt="Logout"
                width={17}
                height={100}
                className="min-w-[17px]"
              />
            )}
          </span>
          <p
            className={`text-[15px] w-full text-start mx-[auto] ${
              sideOpen && sideOpen
                ? "animate__fadeInRight"
                : "animate__fadeOutRight"
            } animate__animated animate__faster `}
          >
            Logout
          </p>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
