"use client";
import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import {
  ref,
  push,
  onValue,
  set,
  serverTimestamp,
  onDisconnect,
  off,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Input, Button, Spinner } from "@nextui-org/react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [typingStatus, setTypingStatus] = useState(""); // Typing status state
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        updateUserStatus(user.displayName, "online");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const userStatusRef = ref(db, `status/${currentUser.displayName}`);

      const isOnline = {
        state: "online",
        lastChanged: serverTimestamp(),
      };

      const isOffline = {
        state: "offline",
        lastChanged: serverTimestamp(),
      };

      const connectedRef = ref(db, ".info/connected");

      const handleConnectedStatus = (snapshot) => {
        if (snapshot.val() === true) {
          set(userStatusRef, isOnline);
          onDisconnect(userStatusRef).set(isOffline);
        } else {
          set(userStatusRef, isOffline);
        }
      };

      onValue(connectedRef, handleConnectedStatus);

      return () => {
        set(userStatusRef, isOffline);
        off(connectedRef, "value", handleConnectedStatus);
      };
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    const messagesRef = ref(db, "messages");
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages = Object.entries(data).map(([key, value]) => ({
          key,
          ...value,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    scrollToBottom();

    return () => unsubscribeMessages();
  }, []);

  useEffect(() => {
    const usersRef = ref(db, "status");
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(data);
      } else {
        setUsers({});
      }
    });

    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    const typingRef = ref(db, "typing");

    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val();
      if (typingData) {
        setTypingStatus(
          Object.keys(typingData)
            .filter((user) => user !== currentUser?.displayName)
            .join(", ")
        );
      } else {
        setTypingStatus("");
      }
    });

    return () => unsubscribeTyping();
  }, [currentUser]);

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const updateUserStatus = (uid, state) => {
    const userStatusRef = ref(db, `status/${uid}`);
    const status = {
      state,
      lastChanged: serverTimestamp(),
    };
    set(userStatusRef, status);
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";

    const now = new Date();
    const date = new Date(timestamp);

    const isToday =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate();

    const isYesterday =
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() - date.getDate() === 1;

    const isLastYear = now.getFullYear() > date.getFullYear();

    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`;
    } else if (isLastYear) {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messagesRef = ref(db, "messages");
        await push(messagesRef, {
          text: newMessage,
          createdAt: Date.now(),
          uid: auth.currentUser?.uid,
          displayName: auth.currentUser?.displayName,
        });

        setNewMessage("");
        handleTyping(false); // Stop typing when message is sent
      } catch (e) {
        console.error("Error sending message:", e);
      }
    }
  };

  const handleTyping = (isTyping) => {
    const typingRef = ref(db, `typing/${currentUser?.displayName}`);
    set(typingRef, isTyping ? true : null);
  };

  return (
    <div className="h-screen p-[20px] flex flex-col justify-between gap-[20px]">
      <h1 className="text-[30px] font-bold">Chat</h1>

      {/* User Status Section */}
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-2">Users</h2>
        <ul className="flex flex-wrap gap-4">
          {Object.entries(users).map(([uid, userStatus]) => (
            <li
              key={uid}
              className={`p-2 rounded-lg ${
                userStatus.state === "online" ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              <p>
                <strong>
                  {uid === currentUser?.displayName ? "You" : uid}
                </strong>
              </p>
              <p className="text-sm">
                {userStatus.state === "online" ? (
                  <span className="font-semibold text-green-600">Online</span>
                ) : (
                  <span className="text-gray-600">
                    Last Seen: {formatLastSeen(userStatus.lastChanged)}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Section */}
      <div className="h-full overflow-y-scroll">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {messages.map((msg) => (
              <div
                key={msg.key}
                className={`p-3 rounded-lg max-w-[90%] overflow-hidden ${
                  msg.uid === auth.currentUser?.uid
                    ? "bg-[#ddd] text-black ml-auto w-[fit-content]"
                    : "bg-gray-200 w-[fit-content]"
                }`}
              >
                <p className="font-light text-[10px]">
                  {msg.uid !== auth.currentUser?.uid && msg.displayName}
                </p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Section */}
      {/* Typing Indicator */}
      {typingStatus && (
        <p className="text-sm italic text-gray-500">
          {typingStatus} {typingStatus.includes(",") ? "are" : "is"} typing...
        </p>
      )}
      <div className="flex items-end gap-[20px]">
        <Input
          clearable
          underlined
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(true); // Start typing when input changes
          }}
          onBlur={() => handleTyping(false)} // Stop typing when input loses focus
        />
        <Button auto size="sm" onClick={handleSendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
