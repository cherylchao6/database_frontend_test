"use client";
import React from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const DashBoardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = (endPoint: string) => {
    router.push(`/dashboard/${endPoint}`);
  };

  return (
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Hello, {session?.user?.name || "User"}
        </h2>
        <h2>
          <span className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to JVN Database System
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Start by selecting a team
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button text="Intake" onClick={() => handleClick("intake")} />
          <Button text="Operations" onClick={() => handleClick("operations")} />
          <Button text="Project Management" onClick={() => handleClick("pm")} />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
