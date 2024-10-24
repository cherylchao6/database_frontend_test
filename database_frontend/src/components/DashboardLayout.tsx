//components/DashboardLayout.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const initialTeams = [
  {
    id: 1,
    name: "Intake",
    href: "/dashboard/intake",
    initial: "I",
    current: false,
  },
  { id: 2, name: "Operations", href: "#", initial: "O", current: false },
  {
    id: 3,
    name: "Project Management",
    href: "#",
    initial: "PM",
    current: false,
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Fetch profile image from Microsoft Graph API
const fetchUserProfileImage = async (accessToken: string) => {
  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/photo/$value",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.log("response", response);
    console.error("Failed to fetch profile image");
    return null;
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob); // Convert the image blob to a URL
};

// Define the layout component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teams, setTeams] = useState(initialTeams);
  const [selectedTeam, setSelectedTeam] = useState("");
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | undefined>(
    "/profile.jpg"
  ); // Default image

  useEffect(() => {
    const getProfileImage = async () => {
      if (
        session &&
        session.user &&
        !session.user.image &&
        session.accessToken
      ) {
        console.log("Fetching profile image...");
        console.log("session", session);
        const imageUrl = await fetchUserProfileImage(
          session.accessToken as string
        );
        if (imageUrl) {
          setProfileImage(imageUrl);
        }
      }
    };
    getProfileImage();
  }, [session]);

  const handleTeamClick = (id: number, teamName: string) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id
          ? { ...team, current: true }
          : { ...team, current: false }
      )
    );
    setSelectedTeam(teamName);
    setSidebarOpen(false);
  };

  const handleLogOutClick = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
                  <img src="/logo.png" className="h-12 w-auto pt-4" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.id}>
                            <a
                              href={team.href}
                              onClick={() =>
                                handleTeamClick(team.id, team.name)
                              }
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
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>

                <button
                  onClick={handleLogOutClick}
                  className="absolute bottom-4 right-6 flex items-center text-white cursor-pointer hover:text-gray-400"
                >
                  <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="sticky top-0 z-40 h-16 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="flex justify-between items-center w-full">
            <div className="shrink-0 items-center">
              <img src="/logo.png" className="h-10 w-auto" />
            </div>
            <div className="text-3xl font-semibold text-white hidden md:block">
              {selectedTeam}
            </div>
            <a href="#">
              <span className="sr-only">Your profile</span>
              <img
                alt=""
                src={profileImage}
                className="h-10 w-10 rounded-full bg-gray-800"
              />
            </a>
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
