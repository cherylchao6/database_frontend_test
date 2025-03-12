"use client"; // Ensure it's a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const IntakePage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();

  // Handle user input and fetch matching project IDs
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]); // Clear results if query is too short
      setNoResults(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/projects/searchIds?id=${encodeURIComponent(value)}`
      );

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data: string[] = await res.json();
      setResults(data);
      setNoResults(data.length === 0); // Show message if no results
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle selection from dropdown → Fill input field
  const handleSelect = (id: string) => {
    setQuery(id); // Fill input field with selected ID
    setResults([]); // Hide dropdown after selection
    setNoResults(false); // Reset "no results" state
  };

  // Handle search button click → Navigate to selected project
  const handleSearchClick = () => {
    if (query.trim() !== "") {
      router.push(`/dashboard/intake/projects/${query}`);
    }
  };

  return (
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative flex items-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            className="w-full mx-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Search by project ID ..."
          />
          <Button text="Go" onClick={handleSearchClick} />
        </div>

        {/* Dropdown for search results */}
        {query.length > 1 && (
          <div className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
            {loading && <p className="text-gray-500 text-sm p-2">Loading...</p>}

            {!loading &&
              results.length > 0 &&
              results.map((id) => (
                <div
                  key={id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-800"
                  onClick={() => handleSelect(id)}
                >
                  {id}
                </div>
              ))}

            {!loading && noResults && (
              <p className="text-gray-500 text-sm p-2">No project ID found</p>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-y-3">
          <a
            href="/dashboard/intake/projects/create"
            className="w-full rounded-md bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            + Add New Project
          </a>
          <a
            href="/dashboard/intake/projects"
            className="w-full rounded-md bg-slate-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View Active Projects
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntakePage;
