import HomeLayout from "../components/HomeLayout";

import { Metadata } from "next";
import Footer from "@/components/Footer";

// Define the metadata
export const metadata: Metadata = {
  title: "JVN Homepage",
  description: "Login Page",
};

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <HomeLayout>
          <h1>Welcome to My Homepage</h1>
        </HomeLayout>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
