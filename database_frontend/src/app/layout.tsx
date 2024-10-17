import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";

// Define the metadata
export const metadata: Metadata = {
  title: "JVN Dashboard",
  description: "Welcome to JVN Database system",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Move the ThemeProvider inside the body */}
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
