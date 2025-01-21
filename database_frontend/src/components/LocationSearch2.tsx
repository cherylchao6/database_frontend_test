import React, { useState, useEffect } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Location {
  id: number;
  name: string;
  address: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location | null) => void;
  initialLocationName?: string;
  initialAddress?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  initialLocationName = "",
  initialAddress = "",
}) => {
  const [searchType, setSearchType] = useState<"name" | "address">("name");
  const [query, setQuery] = useState<string>("");
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLocations = async (type: "name" | "address", value: string) => {
    console.log("fetchLocations", type, value);
    if (!value.trim()) {
      console.log("No value provided");
      setLocationResults([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("fetching locations.......");
      const response = await fetch(`${apiUrl}/locations?${type}=${value}`);
      console.log("response", response);
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data: Location[] = await response.json();
      setLocationResults(data);
      return data;
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLocationResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setQuery("");
    setLocationResults([]);
    onLocationSelect(location);
  };

  // Handle fetching initial location if `initialLocationName` or `initialAddress` is provided
  useEffect(() => {
    const initializeLocation = async () => {
      if (initialLocationName) {
        const data = await fetchLocations("name", initialLocationName);
        if (data && data.length > 0) {
          setSelectedLocation(data[0]);
          onLocationSelect(data[0]);
        }
      } else if (initialAddress) {
        const data = await fetchLocations("address", initialAddress);
        if (data && data.length > 0) {
          setSelectedLocation(data[0]);
          onLocationSelect(data[0]);
        }
      }
    };

    initializeLocation();
  }, [initialLocationName, initialAddress]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchLocations(searchType, query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  return (
    <div className="space-y-6 w-full">
      {/* Dropdown and Search Input */}
      <div className="flex items-center space-x-2 w-full">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "name" | "address")}
          className="pl-2 block w-1/4 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="name">Search by Name</option>
          <option value="address">Search by Address</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${searchType}`}
          className="pl-2 block flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>

      {/* Search Results */}
      {isLoading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
      {!isLoading && query && (
        <ul className="bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-auto">
          {locationResults.length > 0 ? (
            locationResults.map((location) => (
              <li
                key={location.id}
                onClick={() => handleSelectLocation(location)}
                className="cursor-pointer p-2 hover:bg-indigo-100"
              >
                {searchType === "name" ? location.name : location.address}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No Results Found</li>
          )}
        </ul>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="space-y-2">
          <div>
            <label className="block font-medium leading-6 text-gray-900 mb-2">
              Selected Location Name:
            </label>
            <p className="pl-2 block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
              {selectedLocation.name}
            </p>
          </div>
          <div>
            <label className="block font-medium leading-6 text-gray-900 mb-2">
              Selected Address:
            </label>
            <p className="pl-2 block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6">
              {selectedLocation.address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
