"use client";
import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DashBoardPage: React.FC = () => {
  const router = useRouter();

  const handleClick = (endPoint: string) => {
    router.push(`/dashboard/${endPoint}`);
  };

  return (
    <>
      <div className="flex justify-center items-center p-4 ">
        <div className="w-full max-w-lg lg:max-w-2xl rounded-lg p-6 space-y-6 shadow-xl border-gray-100 border-2">
          <div className="flex items-center justify-center">
            <Image
              src="/jvn-logo.png"
              height={250}
              width={400}
              alt="JVN Logo"
              className="rounded-lg w-full h-auto max-w-xs sm:max-w-md"
            />
          </div>
          <div className="mx-auto text-center space-y-4">
            <h2 className="py-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-700 dark:text-white">
              Welcome to JVN Database System!
            </h2>
            <p className="mx-auto text-base sm:text-lg max-w-xl leading-8 text-gray-600 dark:text-white">
              Start by selecting a team
            </p>
            <div className="py-5 flex flex-col items-center justify-center gap-y-3 w-full sm:w-auto">
              <Button
                text="Intake"
                onClick={() => handleClick("intake")}
                className="w-full sm:w-auto"
              />
              <Button
                text="Operations"
                onClick={() => handleClick("operations")}
                className="w-full sm:w-auto"
              />
              <Button
                text="Project Management"
                onClick={() => handleClick("pm")}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
