"use client";
import { Button, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import add from "@/public/icons/add.svg";
import notification from "@/public/icons/notification.svg";
import user from "@/public/icons/user.svg";
import fourSquare from "@/public/icons/fourSquare.svg";
import Image from "next/image";
import { chatContactData } from "@/utils/chatContactData";

const Chats = () => {
  return (
    <div className=" h-full flex flex-col gap-[20px]">
      <div className="rounded-[20px] bg-[#23262f] p-[20px] flex items-center justify-between text-[#fff]">
        <h1 className="text-[22px] font-medium">Chats</h1>
        <div className="flex items-center gap-[10px]">
          <Button className="bg-[#2f80ed] text-[#fff] text-[14px]">
            <Image src={add} width={15} height={100} alt="Add" /> New Chat
          </Button>
          <Button className="min-w-[fit-content] text-[#fff] p-[10px] rounded-[50%] bg-transparent hover:bg-[#ffffff18] relative">
            <span className="absolute w-[6px] h-[6px] bg-[red] rounded-[50%] right-[10.5px] top-[10px]" />
            <Image src={notification} width={20} height={100} alt="Add" />
          </Button>
          <div className=" flex items-center gap-[10px]">
            <Image
              src={user}
              alt="Profile"
              className="w-[35px] h-[35px] rounded-[50%] border-[1px] p-[5px]"
            />
            <p className="text-[15px]">Sharique M.</p>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100%-100px)]">
        <div className="w-[30%]  bg-[#23262f] p-[20px] rounded-[20px] h-[100%] flex flex-col gap-[20px]">
          <header className="flex justify-between text-[#fff]">
            <div className="flex items-center gap-[10px]">
              <p className="text-[20px]">Inbox</p>
              <p className="bg-[#e31748] px-[10px] py-[2px] rounded-[5px] text-[14px] text-[#fff] font-medium">
                3 New
              </p>
            </div>
            <Button className="min-w-[35px] w-[35px] h-[35px] flex items-center justify-center p-0 bg-[#2f80ed]">
              <Image src={fourSquare} alt="Four Square" width={20} />
            </Button>
          </header>
          <div className="flex w-full flex-col h-full">
            <Tabs
              aria-label="Options"
              fullWidth
              style={{
                "--tabs-background": "#1a202c", // Background for the entire Tabs container
                "--tabs-color": "#fff", // Text color
                "--tabs-hover-background": "#2d3748", // Hover background for each tab
                "--tabs-active-background": "#4a5568", // Active tab background
                "--tabs-border-radius": "8px", // Rounded corners
              }}
            >
              <Tab key="primary" title="Primary" className="h-full pb-0 px-0">
                <div className="h-full flex flex-col gap-[10px] animate__animated animate__fadeIn ">
                  {chatContactData?.map((e, i) => {
                    return (
                      <Button
                        className="bg-[#3b3e46] rounded-[5px] text-[#fff] h-[fit-content] p-[10px] flex items-center justify-start text-left gap-[10px]"
                        key={i + 1}
                      >
                        <Image
                          src={e.img}
                          className="w-[30px] rounded-[50%]"
                          alt="my image"
                        />
                        <p className="flex flex-col gap-[5px]">
                          <span>{e.name}</span>
                          <span>{e.msg}</span>
                        </p>
                      </Button>
                    );
                  })}
                </div>
              </Tab>
              <Tab key="group" title="Group" className="h-full pb-0 px-0">
                <div className="h-full animate__animated animate__fadeIn bg-[gray]">
                  acs
                </div>
              </Tab>
              <Tab key="archive" title="Archive" className="h-full pb-0 px-0">
                <div className="h-full animate__animated animate__fadeIn bg-[lightblue]">
                  acs
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
        <div className="w-[70%] ps-[20px] ">
          <div className=" bg-[#23262f] p-[20px] rounded-[20px] h-[100%]"></div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
