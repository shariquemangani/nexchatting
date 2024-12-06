"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import fourSquare from "@/public/icons/fourSquare.svg";
import user from "@/public/icons/user.svg";
import notification from "@/public/icons/notification.svg";
import call from "@/public/icons/call.svg";
import videoCall from "@/public/icons/videoCall.svg";
import cancel from "@/public/icons/cancel.svg";
import send from "@/public/icons/send.svg";
import mic from "@/public/icons/mic.svg";
import search from "@/public/icons/search.svg";
import gallery from "@/public/icons/gallery.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
  onValue,
} from "firebase/database";
import UserContext from "@/context/userContext";
import { getAlluser, getUserData } from "@/api/userApi";
import { CommonModal } from "@/components/commonModal";
import { users } from "@/utils/usersData";

const Chats = () => {
  let { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [messageLoading, setMessageLoading] = useState(true);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [chatListUser, setChatListUser] = useState();
  const [userChats, setUserChats] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState();
  const [allUser, setAllUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user.uid, setLoggedInUser);
        getAlluser(setAllUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      getChatListData();
      getChats();
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (loggedInUser) {
      getChats();
    }
  }, [selectedUserData]);

  const handleAddUser = async (user) => {
    try {
      await set(ref(db, `chatUserList/${loggedInUser.id}/${user.id}`), {
        name: user.fullName,
        id: user.id,
      });
      getChatListData();
    } catch (error) {
      console.log("Error during authentication:", error.message);
    }
  };

  const getChatListData = async () => {
    const dbRef = ref(getDatabase());
    await get(child(dbRef, `chatUserList/${loggedInUser.id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          const userArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setChatListUser(userArray);
        } else {
          console.log("No data available");
          setChatListUser([]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getChats = () => {
    if (!loggedInUser || !selectedUserData) return;
    let nameSort = [loggedInUser.fullName, selectedUserData.name];

    nameSort.sort((a, b) => a.localeCompare(b));
    console.log(loggedInUser.id, selectedUserData.id);
    const chatRef = ref(db, `chats/${nameSort[0]}${nameSort[1]}`);

    try {
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const chatArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setUserChats(chatArray);
          console.log("chatArray", chatArray);
        } else {
          setUserChats([]);
        }
      });
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  const handleSendMessage = async () => {
    let nameSort = [loggedInUser.fullName, selectedUserData.name];

    nameSort.sort((a, b) => a.localeCompare(b));

    if (message) {
      try {
        const messageRef = ref(db, `chats/${nameSort[0]}${nameSort[1]}`);

        await push(messageRef, {
          message: message,
          senderId: loggedInUser.id,
          senderName: loggedInUser.fullName,
          timestamp: new Date().toISOString(),
        });
        getChats();
        setMessage("");

        console.log("Message sent successfully!");
      } catch (error) {
        console.log("Error during sending message:", error.message);
      }
    }
  };

  return (
    <div className=" h-full flex flex-col gap-[20px] animate__animated  animate__fadeIn">
      <div className="rounded-[20px] bg-[#23262f] p-[20px] flex items-center justify-between text-[#fff]">
        <h1 className="text-[22px] font-medium">Chats</h1>
        <div className="flex items-center gap-[10px]">
          <CommonModal
            triggerButtonLabel="New Chat"
            title="New Chat"
            content={
              <>
                <Autocomplete
                  classNames={{
                    base: "w-[100%]",
                    listboxWrapper: "max-h-[250px]",
                    selectorButton: "text-default-500",
                  }}
                  defaultItems={users}
                  inputProps={{
                    classNames: {
                      input: "ml-1",
                      inputWrapper: "h-[48px]",
                    },
                  }}
                  listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                      base: [
                        "rounded-medium",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[hover=true]:bg-default-200",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  aria-label="Select an employee"
                  placeholder="Enter User Name"
                  popoverProps={{
                    offset: 10,
                    classNames: {
                      base: "rounded-large",
                      content:
                        "p-1 border-small border-default-100 bg-background",
                    },
                  }}
                  startContent={
                    <Image src={search} width={15} height={100} alt="search" />
                  }
                  radius="full"
                  variant="bordered"
                  onSelectionChange={(selected) => {
                    const user = allUser.find((user) => user.id === selected);
                    handleAddUser(user);
                  }}
                >
                  {allUser
                    ?.filter((user) => user.id !== loggedInUser.id)
                    ?.map((user) => (
                      <AutocompleteItem key={user.id} textValue={user.fullName}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={user.fullName}
                              className="flex-shrink-0"
                              size="sm"
                              src={user.avatar}
                            />

                            <div className="flex flex-col">
                              <span className="text-small">
                                {user.fullName}
                              </span>
                              <span className="text-tiny text-default-400">
                                {user.id}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="border-small mr-0.5 font-medium shadow-small"
                            radius="full"
                            size="sm"
                            variant="bordered"
                          >
                            Add
                          </Button>
                        </div>
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </>
            }
            // footerButtons={[
            //   {
            //     label: "Close",
            //     color: "danger",
            //     onClick: (onClose) => onClose(),
            //   },
            //   {
            //     label: "Add",
            //     onClick: () => handleAddUser(),
            //   },
            // ]}
          />

          <Button className="min-w-[fit-content] text-[#fff] p-[10px] rounded-[50%] bg-transparent hover:bg-[#ffffff18] relative">
            <span className="absolute w-[6px] h-[6px] bg-[red] rounded-[50%] right-[10.5px] top-[10px]" />
            <Image src={notification} width={20} height={100} alt="Add" />
          </Button>
          <div className=" flex items-center gap-[10px]">
            <Image
              src={user}
              width={100}
              height={100}
              alt="Profile"
              className="w-[35px] h-[35px] rounded-[50%] border-[1px] p-[5px]"
            />
            <p className=" min-w-[100px] text-[15px] capitalize ">
              {loggedInUser?.fullName}
            </p>
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
              <Image
                src={fourSquare}
                alt="Four Square"
                width={20}
                height={100}
              />
            </Button>
          </header>
          <div className="flex w-full flex-col h-[calc(100%-50px)]">
            <Tabs aria-label="Tabs sizes" fullWidth size="lg">
              <Tab
                key="primary"
                title="Primary"
                className="h-full pb-0 px-0 overflow-y-scroll"
              >
                {chatListUser && chatListUser.length <= 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <h1 className="font-semibold text-[20px] text-[#fff]">
                      No Message...
                    </h1>
                  </div>
                ) : (
                  <div className=" flex flex-col gap-[10px] animate__animated animate__fadeIn ">
                    {chatListUser &&
                      chatListUser?.map((user, i) => (
                        <Button
                          className="hover:bg-[#3b3e46] bg-transparent rounded-[5px] text-[#fff] h-[fit-content] p-[10px] flex items-center justify-start text-left gap-[10px]"
                          key={user.id}
                          onClick={() => {
                            if (!loggedInUser) {
                              console.error("loggedInUser is undefined");
                              return;
                            }
                            setSelectedUserData(user);
                            setMessageLoading(false);
                            // handleClickedChat(user);
                          }}
                        >
                          <Avatar
                            alt={user.fullName}
                            className="flex-shrink-0"
                            size="sm"
                            src={`https://d2u8k2ocievbld.cloudfront.net/memojis/male/${
                              i + 1
                            }.png`}
                          />
                          <p className="flex flex-col gap-1">
                            <span className="font-medium">
                              {user.name || "Unknown User"}
                            </span>
                            {/* Uncomment for message preview */}
                            {/* <span className="text-gray-400 text-sm">
                              {userChats && userChats.length > 0
                                ? userChats[userChats.length - 1].message
                                : "No messages yet"}
                            </span> */}
                          </p>
                        </Button>
                      ))}
                  </div>
                )}
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
          <div
            className={` bg-[#23262f] p-[20px] rounded-[20px] h-[100%] overflow-hidden ${
              messageLoading ? "flex items-center justify-center" : ""
            }`}
          >
            {messageLoading ? (
              <div className=" overflow-hidden w-[500px] animate__animated animate__fadeIn">
                <DotLottieReact
                  src="https://lottie.host/77d7d6b9-76e6-43e2-a6a3-ef5a5c0d6481/hKf2SRDXfb.lottie"
                  loop
                  autoplay
                />
              </div>
            ) : (
              <div className="flex flex-col h-full gap-[20px]">
                <div className="flex justify-between animate__animated animate__fadeIn">
                  <div className="bg-transparent rounded-[5px] text-[#fff] h-[fit-content]  flex items-center justify-start text-left gap-[10px]">
                    <div className="border  rounded-[50%]">
                      <Avatar
                        alt={user.fullName}
                        className="flex-shrink-0"
                        size="sm"
                        src={`https://d2u8k2ocievbld.cloudfront.net/memojis/male/${1}.png`}
                      />
                    </div>
                    <p className="flex flex-col ">
                      <span>{selectedUserData.name}</span>
                      <span className="text-[#858598]">Active</span>
                    </p>
                  </div>
                  <div className="">
                    <Button className="min-w-[auto] w-[35px] h-[35px] rounded-[10px] mx-[5px] bg-[#dddddd20] p-[10px]">
                      <Image
                        src={videoCall}
                        width={100}
                        height={100}
                        alt="image"
                        className="w-[15px]"
                      />
                    </Button>
                    <Button className="min-w-[auto] w-[35px] h-[35px] rounded-[10px] mx-[5px] bg-[#dddddd20] p-[10px]">
                      <Image
                        src={call}
                        alt="image"
                        width={100}
                        height={100}
                        className="w-[15px]"
                      />
                    </Button>
                    <Button
                      className="min-w-[auto] w-[35px] h-[35px] rounded-[10px] mx-[5px] bg-[#dddddd20] p-[10px]"
                      onClick={() => {
                        setMessageLoading(true), setSelectedUserData([]);
                      }}
                    >
                      <Image
                        src={cancel}
                        width={100}
                        height={100}
                        alt="image"
                        className="w-[15px]"
                      />
                    </Button>
                  </div>
                </div>
                <div className="h-[calc(100%-80px)] text-[#fff] animate__animated animate__fadeIn bg-[#3b3e46] rounded-[20px]">
                  <div className="  h-[calc(100%-80px)] overflow-y-scroll flex flex-col gap-[10px] p-[10px]">
                    {userChats &&
                      userChats?.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`w-fit p-[10px] rounded-[10px] bg-[#23262f] 
                          ${msg.senderId === loggedInUser.id ? "ms-auto" : ""}`}
                        >
                          <p>{msg.message}</p>
                          {/* <span>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span> */}
                        </div>
                      ))}
                  </div>
                  <div className=" h-[80px] flex items-center gap-[10px] p-[20px]">
                    <input
                      type="text"
                      className="p-[10px] text-[15px] bg-[#23262f] border-none outline-none rounded-[10px] w-[100%]"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    />

                    <Button
                      className="min-w-[40px] w-[40px] h-[40px] rounded-[10px] bg-[#2f80ed] p-0"
                      onClick={() => handleSendMessage()}
                    >
                      <Image
                        src={send}
                        width={100}
                        height={100}
                        alt="image"
                        className="w-[18px]"
                      />
                    </Button>
                    <Button className="min-w-[40px] w-[40px] h-[40px] rounded-[10px] bg-[#23262f] p-0">
                      <Image
                        src={mic}
                        width={100}
                        height={100}
                        alt="image"
                        className="w-[18px]"
                      />
                    </Button>
                    <Button className="min-w-[40px] w-[40px] h-[40px] rounded-[10px] bg-[#23262f] p-0">
                      <Image
                        src={gallery}
                        width={100}
                        height={100}
                        alt="image"
                        className="w-[18px]"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
