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
      <div>
        <div className="flex justify-center">
          <div className=" w-1/2 rounded-lg p-6 space-y-4 shadow-sm border-gray-100 border-2">
            <div className="flex items-center justify-center ">
              <Image
                src="/jvn-logo.png"
                height={250}
                width={400}
                alt="JVN Logo"
                className="rounded-lg "
              />
            </div>
            <div className="mx-auto max-w-2xl text-center space-y-4 ">
              <h2 className="py-4 text-2xl font-bold tracking-tight text-gray-700 sm:text-3xl dark:text-white">
                Welcome to JVN Database System!
              </h2>
              <p className="mx-auto max-w-xl text-lg leading-8 text-gray-600 dark:text-white">
                Start by selecting a team
              </p>
              <div className="py-5 flex flex-col items-center justify-center gap-y-3">
                <Button text="Intake" onClick={() => handleClick("intake")} />
                <Button
                  text="Operations"
                  onClick={() => handleClick("operations")}
                />
                <Button
                  text="Project Management"
                  onClick={() => handleClick("pm")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardPage;
