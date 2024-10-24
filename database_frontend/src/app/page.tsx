"use client";
import HomeLayout from "../components/HomeLayout";
import { signIn } from "next-auth/react";

const HomePage = () => {
  const handleLoginClick = async () => {
    try {
      console.log("Login button clicked");
      // await signIn();
      await signIn("azure-ad");
      // const result = await signIn("azure-ad", undefined, {
      //   prompt: "login", // 強制要求用戶重新登入
      // });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to JVN Database System
        </h1>
        <p className="text-lg mb-10">Please login to access the system.</p>
        <button
          onClick={handleLoginClick}
          className="bg-black text-white hover:bg-gray-800 hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Login
        </button>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
