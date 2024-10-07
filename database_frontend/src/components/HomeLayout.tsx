"use client";

import Image from "next/image";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div>
        <div className="sticky top-0 z-40 h-16 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6">
          <div className="flex justify-between items-center w-full">
            <div className="shrink-0 items-center">
              <Image
                src="/logo.png"
                width={250}
                height={100}
                className="h-10 w-auto"
                alt="ontario-logo"
              />
            </div>
            <div className="text-3xl font-semibold text-white hidden md:block">
              Welcome
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

export default HomeLayout;
