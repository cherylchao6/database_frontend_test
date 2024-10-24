"use client";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <div>
        <div className="sticky top-0 z-40 h-16 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6">
          <div className="flex justify-between items-center w-full">
            <div className="shrink-0 items-center">
              <img src="/logo.png" className="h-10 w-auto" />
            </div>
            <div className="text-3xl font-semibold text-white hidden md:block">
              Welcome
            </div>
          </div>
        </div>

        <main>
          <div>{children}</div>
        </main>
      </div>
    </>
  );
};

export default HomeLayout;
