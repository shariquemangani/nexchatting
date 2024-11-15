"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebaseConfig";
import { ref, push, getDatabase, onValue } from "firebase/database";
import { Input, Button, Spinner } from "@nextui-org/react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);

  useEffect(() => {
    setLoading(true);
    const db = getDatabase();
    const starCountRef = ref(db, "messages");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(Object.values(data));
      setLoading(false);
    });
  }, []);

  const handleSendMessage = async () => {
    setLoading(true);
    try {
      if (newMessage.trim()) {
        const messagesRef = ref(db, "messages");
        await push(messagesRef, {
          text: newMessage,
          createdAt: Date.now(),
          uid: auth.currentUser?.uid,
        }).then((e) => {
          setNewMessage("");
          const db = getDatabase();
          const starCountRef = ref(db, "messages");
          onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setMessages(Object.values(data));
            console.log(Object.values(data));
            setLoading(false);
          });
        });
      }
    } catch (e) {
      console.log("Error sending message:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : hasMessages ? (
        <div className="mb-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i + 1}
              className={`p-3 rounded-lg ${
                msg.uid === auth.currentUser?.uid
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200"
              } max-w-xs`}
            >
              <p>
                {msg.displayName}: {msg.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No messages yet. Be the first to start the conversation!</p>
      )}
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
