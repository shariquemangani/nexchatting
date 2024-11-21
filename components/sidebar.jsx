"use client";

import { sidebarData } from "@/utils/sidebarData";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logout from "@/public/icons/logout.svg";

import React from "react";

const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="min-w-[200px] h-full bg-[#23262f] rounded-[20px] py-[20px] px-[5px] text-[white] flex flex-col justify-between">
      <div className="flex flex-col gap-[20px]">
        <div className="px-[15px] flex items-center gap-[10px]">
          {/* <Image
            // src=""
            width={50}
            height={10}
            alt="Profile"
            className="w-[35px] h-[35px] rounded-[50%] border-[1px] border-[#ddd]"
          /> */}
          <p className="text-[15px]">Sharique M.</p>
        </div>
        <div className="flex flex-col gap-[10px]">
          {sidebarData.map((e, i) => {
            return (
              <div className="w-full flex items-center relative" key={i + 1}>
                {pathName === e.path && (
                  <p className="absolute h-[80%] w-[5px] bg-white rounded-e-[5px] left-[-5px]"></p>
                )}
                <Button
                  className="w-full bg-transparent hover:bg-[#a0a0a020] text-[#fff] flex items-center justify-start gap-[15px] "
                  onClick={() => router.push(e.path)}
                >
                  <Image src={e.icon} alt="Chat" width={17} height={100} />{" "}
                  <p>{e.name}</p>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="">
        <Button
          className="w-full bg-transparent hover:bg-[#a0a0a020] text-[#fff] flex items-center justify-start gap-[15px]"
          onClick={() => router.push("/")}
        >
          <Image src={logout} alt="Logout" width={17} height={100} />
          <p> Logout</p>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
