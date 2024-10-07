import React from "react";
import Link from "next/link";

// Define footage component
const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-gray-900 text-gray-100 text-sm font-light">
        <div className="py-3 px-5 w-full flex  justify-between items-center lg:flex-row flex-col  ">
          <div className="flex flex-row space-x-2 ">
            <Link href="/">
              <div className="hover:text-slate-400">Contact</div>
            </Link>
            <Link href="https://www.ontario.ca/page/terms-use">
              <div className="hover:text-slate-400">Term of Use</div>
            </Link>
            <Link href="https://www.ontario.ca/page/accessibility">
              <div className="hover:text-slate-400">Accessibility</div>
            </Link>

            <Link href="https://www.ontario.ca/page/terms-use">
              <div className="hover:text-slate-400">Privacy</div>
            </Link>
          </div>
          <p className=" sm:ml-4 sm:pl-4  sm:py-2 sm:mt-0 mt-4 r">
            Copyright © 2024 Justice Video Network, Ministry of the Solictor
            General. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
