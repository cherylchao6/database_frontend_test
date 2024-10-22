//components/DashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // Theme switcher

const initialTeams = [
  {
    id: 1,
    name: "Intake",
    href: "/dashboard/intake",
    initial: "I",
    current: false,
  },
  {
    id: 2,
    name: "Operations",
    href: "/dashboard/operations",
    initial: "O",
    current: false,
  },
  {
    id: 3,
    name: "Project Management",
    href: "/dashboard/pm",
    initial: "PM",
    current: false,
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/////////////////////// Define the layout component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false); // For client-side rendering

  // Ensure the component is mounted before accessing the theme
  useEffect(() => setMounted(true), []);

  // Call the hook at the top level
  const pathName = usePathname();

  // Only render the icon once the component is mounted
  if (!mounted) return null;

  // Validate the current team
  const currentTeam = initialTeams.find((team) =>
    pathName.startsWith(team.href)
  )?.name;

  const handleTeamClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Slide Bar */}
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <Image
                    src="/logo.png"
                    alt="ontario-logo"
                    width={400}
                    height={300}
                    className="p-6"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <div className="text-md font-semibold leading-6 text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1 ">
                        {initialTeams.map((team) => (
                          <li key={team.id}>
                            <Link
                              href={team.href}
                              onClick={handleTeamClick}
                              className={classNames(
                                team.current
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                {team.initial}
                              </span>
                              <span className="truncate ">{team.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Nav-bar */}
        <div className="sticky top-0 z-40 h-16 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6">
          {/* Hamburger button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
          {/* Logo button and PageHeader */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <div className="shrink-0 items-center">
                <Image
                  src="/logo.png"
                  alt="ontario-logo"
                  width={150}
                  height={55}
                />
              </div>
              {/* Current Module */}
              <div className="font-mono text-2xl font-semibold text-white hidden md:block">
                {currentTeam ? currentTeam : "JVN Dashboard"}
              </div>
            </div>

            {/* User profile */}
            <div className="flex items-center justify-between space-x-3">
              {/* Theme swich */}
              <div className="flex space-x-1">
                {theme === "dark" ? (
                  <button onClick={() => setTheme("light")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => setTheme("dark")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <a href="#">
                <span className="sr-only">Your profile</span>
                <Image
                  alt=""
                  src="/profile.jpg"
                  width={100}
                  height={100}
                  className="h-10 w-10 rounded-full bg-gray-800"
                />
              </a>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-20">{children}</div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
