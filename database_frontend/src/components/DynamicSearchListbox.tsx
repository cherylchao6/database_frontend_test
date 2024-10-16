import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Person {
  id: number;
  name: string;
  avatar: string;
}

interface DynamicSearchDropdownProps {
  label: string;
  assignedTo: Person[] | [];
  setAssignedTo: (value: Person[]) => void;
  fetchOptions: (query: string) => Promise<Person[]>; // API fetch function passed as a prop
  allowMultiple?: boolean; // New prop to allow multiple selection
}

const DynamicSearchDropdown = ({
  label,
  assignedTo,
  setAssignedTo,
  fetchOptions,
  allowMultiple = false,
}: DynamicSearchDropdownProps) => {
  const [people, setPeople] = useState<Person[]>([]); // Options from API
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [loading, setLoading] = useState(false); // Loading state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility state
  const [showNoResults, setShowNoResults] = useState(false); // No results found

  // Fetch people immediately when searchQuery changes, without debounce
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchPeople(searchQuery);
    } else {
      setPeople([]);
      setDropdownOpen(false); // Close dropdown if query is too short
    }
  }, [searchQuery]);

  const fetchPeople = async (query: string) => {
    setLoading(true);
    setShowNoResults(false);
    try {
      const data = await fetchOptions(query);
      if (data.length === 0) {
        setShowNoResults(true); // Show "No results" if the API returns an empty array
        setDropdownOpen(true); // Open dropdown for "No results found"
      } else {
        setPeople(data);
        setDropdownOpen(true); // Open dropdown if results exist
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  const handleSelectPerson = (person: Person) => {
    if (allowMultiple) {
      // For multiple selection
      const selected = assignedTo as Person[]; // Assume assignedTo is an array
      if (!selected.some((p) => p.id === person.id)) {
        setAssignedTo([...selected, person]); // Add person to the array
      }
    } else {
      setAssignedTo([person]);
    }
    setDropdownOpen(false); // Close dropdown after selection
    setSearchQuery(""); // Clear search input after selection
  };

  const handleRemovePerson = (personToRemove: Person) => {
    if (allowMultiple) {
      const filtered = (assignedTo as Person[]).filter(
        (p) => p.id !== personToRemove.id
      );
      setAssignedTo(filtered);
    } else {
      setAssignedTo([]);
    }
  };

  return (
    <div className="relative sm:col-span-3">
      <label className="block font-medium leading-6 text-gray-900">
        {label}
      </label>

      {/* Search input field - always show if allowMultiple is true */}
      {allowMultiple || assignedTo.length === 0 ? (
        <input
          type="text"
          placeholder="Search for a person..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onFocus={() => searchQuery.length > 2 && setDropdownOpen(true)}
        />
      ) : null}

      {/* Dropdown options */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {loading ? (
            <div className="py-2 px-3 text-gray-500">Loading...</div>
          ) : showNoResults ? (
            <div className="py-2 px-3 text-gray-500">No results found</div>
          ) : (
            people.map((person) => (
              <div
                key={person.id}
                onClick={() => handleSelectPerson(person)}
                className="cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
              >
                <div className="flex items-center">
                  <img
                    alt=""
                    src={person.avatar}
                    className="h-5 w-5 flex-shrink-0 rounded-full"
                  />
                  <span className="ml-3 block truncate">{person.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Display selected person(s) */}
      <div className="mt-2 flex flex-wrap">
        {assignedTo.map((person) => (
          <div key={person.id} className="flex items-center mr-2">
            {/* For each person in the array, display their avatar and name */}
            <img
              alt=""
              src={person.avatar}
              className="h-6 w-6 flex-shrink-0 rounded-full"
            />
            <span className="ml-2 text-gray-900">{person.name}</span>
            <button
              type="button"
              onClick={() => handleRemovePerson(person)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicSearchDropdown;
