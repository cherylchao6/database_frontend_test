import React from "react";
import Button from "@/components/Button";

import { Metadata } from "next";

// Define the metadata
export const metadata: Metadata = {
  title: "Intake",
  description: "Intake Module",
};

const IntakePage: React.FC = () => {
  return (
    <>
      <div className=" flex-col space-y-5">
        <div className="mx-auto max-w-2xl text-center p-10  border-gray-100 border-2 rounded-lg  shadow-sm">
          <div className="relative flex items-center w-full">
            {/* Search Icon */}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 text-slate-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Search Input */}
            <input
              className="w-1/2 grow mx-2 bg-transparent placeholder:text-slate-400 dark:text-white text-slate-700 text-lg border border-slate-200 
              rounded-lg pl-10 pr-3 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search by project ID ..."
            />

            {/* Search Button */}
            <div className="w-1/4">
              <Button text="Search" />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-y-3 justify-center items-center">
            <a
              href="/dashboard/intake/projects/create"
              className="w-1/2 rounded-md bg-indigo-700 p-4 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              + Add New Project
            </a>
            <a
              href="/dashboard/intake/projects"
              className="w-1/2 rounded-md bg-slate-500 p-4 text-md font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Active Projects
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntakePage;
