"use client";
import { UserProvider } from "@/context/userContext";
import Script from "next/script";
import "./globals.css";
import "animate.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-full">
        <UserProvider>{children}</UserProvider>
        {/* <Script
          src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
          type="module"
          strategy="afterInteractive" // Ensures the script loads after the page is interactive
        /> */}
      </body>
    </html>
  );
}
