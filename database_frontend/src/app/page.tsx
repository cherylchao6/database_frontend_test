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
      <div
        className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-black"
        style={{ backgroundImage: 'url("/court.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
        <div className="relative z-10 backdrop-blur-lg bg-white/60 rounded-lg shadow-lg p-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6 text-black">
            Welcome to JVN Database System
          </h1>
          <p className="text-lg mb-10 text-black">
            Please login to access the system.
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
