"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { ref, push, onValue } from "firebase/database";
import { Input, Button, Spinner } from "@nextui-org/react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const messagesRef = ref(db, "messages");
    const getallMessage = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
        console.log(Object.values(data));
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => getallMessage();
  }, []);
  // console.log(auth.currentUser?.displayName);

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
      } catch (e) {
        console.error("Error sending message:", e);
      }
    }
  };

  return (
    <div className="h-screen p-[20px] flex flex-col justify-between gap-[20px]">
      <h1 className="text-[30px] font-bold">Chat</h1>
      <div className=" h-full overflow-y-scroll">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.uid === auth.currentUser?.uid
                    ? "bg-[#ddd] text-black ml-auto"
                    : "bg-gray-200"
                } max-w-xs`}
              >
                <p className="font-light text-[10px]">
                  {msg.uid === auth.currentUser?.uid && msg.displayName}
                </p>
                <p className="w-full text-wrap overflow-hidden">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Input
          clearable
          underlined
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          onPress={handleSendMessage}
          className="bg-[#b9b9b9] font-semibold"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
