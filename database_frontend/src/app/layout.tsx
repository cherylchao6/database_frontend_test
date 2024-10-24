"use client";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ProtectedComponents } from "@/components/ProtectedComponents";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      {/*wrap */}
      <body>
        <SessionProvider>
          <ProtectedComponents>{children}</ProtectedComponents>
          {/* <body>{children}</body> */}
        </SessionProvider>
        {/* <body>{children}</body> */}
      </body>
    </html>
  );
};

export default RootLayout;
