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
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => getallMessage();
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <div className="">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.uid === auth.currentUser?.uid
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200"
                } max-w-xs`}
              >
                <p>{msg.text}</p>
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
        <Button color="gradient" onPress={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
