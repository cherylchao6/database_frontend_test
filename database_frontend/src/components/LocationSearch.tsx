import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Location {
  id: number;
  name: string;
  address: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location | null) => void;
  initialLocationName?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  initialLocationName = "",
}) => {
  // get user token and determine if user has permission
  // const user = useSession().data?.user as CustomUser;
  const hasPermission = false;

  const [locationQuery, setLocationQuery] =
    useState<string>(initialLocationName);
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false); // 控制 Edit Modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // 控制确认修改的 Modal
  const [newLocationName, setNewLocationName] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [errors, setErrors] = useState<{ name: boolean; address: boolean }>({
    name: false,
    address: false,
  });

  const fetchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocationResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/locations?name=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data: Location[] = await response.json();
      setLocationResults(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLocationResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setAddress(location.address);
    setLocationQuery(location.name);
    setLocationResults([]);
    setHasSearched(false);
    onLocationSelect(location);
  };

  useEffect(() => {
    const fetchInitialLocation = async () => {
      if (!initialLocationName) {
        setAddress("");
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/locations?name=${initialLocationName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch initial location");
        }
        const data: Location[] = await response.json();

        if (data.length > 0) {
          const location = data[0];
          setSelectedLocation(location);
          setLocationQuery(location.name);
          setAddress(location.address);
          onLocationSelect(location);
        }
      } catch (err) {
        console.error("Error fetching initial location:", err);
      }
    };

    fetchInitialLocation();
  }, [initialLocationName]);

  useEffect(() => {
    if (!locationQuery.trim()) {
      setAddress("");
    }
    if (!locationQuery.trim() || locationQuery === initialLocationName) {
      setLocationResults([]);
      return;
    }

    setHasSearched(true);
    const delayDebounceFn = setTimeout(() => {
      fetchLocations(locationQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [locationQuery, initialLocationName]);

  const handleCreateLocation = () => {
    const hasErrors = {
      name: !newLocationName.trim(),
      address: !newAddress.trim(),
    };

    setErrors(hasErrors);
    if (hasErrors.name || hasErrors.address) return;

    const newLocation: Location = {
      id: Date.now(),
      name: newLocationName,
      address: newAddress,
    };

    setSelectedLocation(newLocation);
    setLocationQuery(newLocationName);
    setAddress(newAddress);
    setShowCreateModal(false);
    onLocationSelect(newLocation);

    setNewLocationName("");
    setNewAddress("");
  };

  // 点击 "Save" 后展示确认对话框
  const handleSaveEditAddress = () => {
    if (!selectedLocation) return;
    setShowEditModal(false);
    setShowConfirmModal(true); // 打开确认对话框
  };

  // 确认修改地址
  const handleConfirmUpdateAddress = () => {
    console.log("Confirmed update address");
    if (!selectedLocation) return;

    const updatedLocation = {
      ...selectedLocation,
      address: newAddress,
    };

    console.log("Updated Location:", updatedLocation);
    setAddress(newAddress);
    setSelectedLocation(updatedLocation);
    setShowConfirmModal(false);
    onLocationSelect(updatedLocation); // 通知父组件地址已修改
  };

  return (
    <div className="space-y-6">
      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block font-medium leading-6 text-gray-900 mb-2"
        >
          Address
        </label>
        <div className="flex">
          <input
            id="address"
            type="text"
            value={selectedLocation ? address : ""}
            readOnly
            placeholder="Search address"
            className="pl-2 block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
          {hasPermission && selectedLocation && (
            <button
              onClick={() => setShowEditModal(true)}
              type="button"
              className="ml-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Edit Address
            </button>
          )}
        </div>
      </div>

      {/* Location Name */}
      <div className="relative">
        <label
          htmlFor="locationName"
          className="block font-medium leading-6 text-gray-900 mb-2"
        >
          Location Name
        </label>
        <div className="flex">
          <div className="w-2/6">
            <input
              id="locationName"
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Search location name"
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {isLoading && (
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            )}
            {!isLoading && locationQuery && hasSearched && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-auto w-2/6">
                {locationResults.length > 0 ? (
                  locationResults.map((location) => (
                    <li
                      key={location.id}
                      onClick={() => handleSelectLocation(location)}
                      className="cursor-pointer p-2 hover:bg-indigo-100"
                    >
                      {location.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No Location Found</li>
                )}
              </ul>
            )}
          </div>
          {hasPermission && (
            <button
              onClick={() => {
                setShowCreateModal(true);
                setNewLocationName(""); // 初始化名稱
                setNewAddress(""); // 初始化地址
              }}
              type="button"
              className="ml-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add New Location
            </button>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={setShowCreateModal}
        title="Create New Location"
        content={
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                Location Name is required.
              </p>
            )}
            <input
              type="text"
              placeholder="Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">Address is required.</p>
            )}
          </div>
        }
        confirmLabel="Save"
        confirmAction={handleCreateLocation}
        cancelLabel="Cancel"
      />

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={setShowEditModal}
        title="Edit Address"
        content={
          <input
            type="text"
            placeholder="Edit Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        }
        confirmLabel="Save"
        confirmAction={handleSaveEditAddress}
        cancelLabel="Cancel"
      />

      {/* Confirm Modal */}
      <Modal
        open={showConfirmModal}
        onClose={setShowConfirmModal}
        title="Confirm Update"
        content={
          <p>
            Are you sure you want to update the address of{" "}
            <strong>{selectedLocation?.name}</strong>?
          </p>
        }
        confirmLabel="Yes"
        confirmAction={handleConfirmUpdateAddress}
        cancelLabel="No"
      />
    </div>
  );
};

export default LocationSearch;
