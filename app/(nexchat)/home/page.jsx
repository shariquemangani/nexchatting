"use client";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

const Home = () => {
  const router = useRouter();

  const goToChat = () => {
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 text-gray-800">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to <span className="text-purple-600">NexChat</span>
        </h1>
        <p className="text-lg text-gray-700 mb-10 max-w-3xl">
          Experience the future of communication with NexChat. Chat in
          real-time, create groups, and enjoy secure conversations — all in one
          platform.
        </p>
        <Button
          color="primary"
          size="lg"
          shadow
          onPress={goToChat}
          className="font-semibold"
        >
          Go to Chats
        </Button>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-10">
          Why Choose <span className="text-blue-500">NexChat?</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-8 px-6">
          <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">
              Real-Time Messaging
            </h3>
            <p className="text-gray-700">
              Enjoy instant messaging with lightning-fast delivery and smooth
              conversations.
            </p>
          </div>
          <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-purple-500 mb-4">
              Group Chats
            </h3>
            <p className="text-gray-700">
              Connect with friends and communities by creating or joining groups
              effortlessly.
            </p>
          </div>
          <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">
              Secure Communication
            </h3>
            <p className="text-gray-700">
              Protect your conversations with industry-leading encryption
              technology.
            </p>
          </div>
          <div className="max-w-sm p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-purple-500 mb-4">
              Personalized Profiles
            </h3>
            <p className="text-gray-700">
              Create a unique profile with custom photos, statuses, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 text-gray-600">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Stay Connected</h2>
          <p className="text-gray-700 mb-6">
            NexChat helps you connect with your loved ones, no matter where you
            are.
          </p>
          <Button color="secondary" size="lg" shadow onPress={goToChat}>
            Start Chatting
          </Button>
          <p className="mt-10 text-sm">© 2024 NexChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
