// pages/test.tsx
import React from "react";
import Link from "next/link";

const TestPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-orange-500">
        Hello world!
      </h1>
      <p>
        <Link href="/">Go back to the homepage</Link>
      </p>
    </div>
  );
};

export default TestPage;
