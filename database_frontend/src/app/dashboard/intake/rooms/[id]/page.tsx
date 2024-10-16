"use client";
import { useState } from "react";
import { Room } from "@/types/intakes/room";
import { Solution } from "@/types/intakes/solution";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/Modal";
import {
  businessRegion,
  buildingTypes,
  hoursOfOperations,
  supportLevel,
  levelOfCourt,
  solutionType,
  roomFunction,
  systemControlType,
  features,
} from "constants/intake/dropDownOptions";
// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fakeRoomData: Room = {
  ministry: "Ministry of Health",
  division: "Health Services",
  branchSiteName: "Vancouver General Hospital",
  city: "Vancouver",
  streetAddress: "1234 Fake St",
  floor: "1",
  roomNumber: "123",
  postalCode: "V5T 1A1",
  businessRegion: "East",
  buildingType: "Correctional Institution",
  hoursOfOperation: "24/7",
};

const fakeSolutionData: Solution = {
  siteAlias: "VGH",
  codecAlias: "VGH",
  systemName: "VGH System",
  supportLevel: "Legacy Support",
  levelOfCourt: "Supreme",
  solutionType: "Courtroom",
  solutionTypeIfOther: "",
  roomFunction: "Courtroom",
  roomFunctionIfOther: "",
  secondaryRoomFunctions: "Admin Meetings",
  features: [
    { id: "1", feature: "Soft Codec Audio Only" },
    { id: "2", feature: "Audio Uplift" },
    { id: "3", feature: "Codec Video Conferencing" },
  ],
  systemCtrlType: "Type 1",
  audioConfePhoneNum: "1234567890",
  privacyNum: "1234567890",
  hasLocalConnec: false,
  localConnecRooms: [],
};

// const fetchRoomData = async (id: string) => {
//   const response = await fetch(`${apiUrl}/intakes/rooms/${id}`);
//   return response.json();
// };

const RoomSolutionPage = () => {
  // const pathname = usePathname();
  // const id = pathname.split("/").pop();
  // Fetch project data based on the project ID from the URL
  // useEffect(() => {
  //   if (id) {
  //     fetchRoomData(id);
  //   }
  // }, [id]);
  const [roomData, setRoomData] = useState(fakeRoomData);
  const [solutionData, setSolutionData] = useState(fakeSolutionData);
  const [addFeatureOpen, setAddFeatureOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [room, setRoom] = useState<{
    alias: string;
    roomNum: string;
  }>({
    alias: "",
    roomNum: "",
  });
  const [roomInputError, seRoomInputError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() =>
    solutionData.features.map((feature) => feature.id)
  );

  const handleToggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures((prev) =>
        prev.filter((featureId) => featureId !== id)
      );
    } else {
      setSelectedFeatures((prev) => [...prev, id]);
    }
  };

  const handleSaveFeatures = () => {
    const updatedFeatures = features.filter((feature) =>
      selectedFeatures.includes(feature.id)
    );

    setSolutionData((prevState) => ({
      ...prevState,
      features: updatedFeatures,
    }));

    setAddFeatureOpen(false);
  };

  const handleRemoveFeature = (featureId: string) => {
    const updatedFeatures = selectedFeatures.filter((id) => id !== featureId);

    setSelectedFeatures(updatedFeatures);
    setSolutionData((prevState) => ({
      ...prevState,
      features: prevState.features.filter(
        (feature) => feature.id !== featureId
      ),
    }));
  };

  const handleSaveRoom = () => {
    console.log(room);
    if (room.alias === "" || room.roomNum === "") {
      seRoomInputError("* Please enter both alias and room number.");
      return;
    }

    setCreateRoomOpen(false); // Close modal
    seRoomInputError(null); // Clear error message
    setSolutionData((prevState) => {
      return {
        ...prevState,
        localConnecRooms: [
          { alias: room.alias, roomNum: room.roomNum },
          ...(prevState.localConnecRooms || []),
        ],
      };
    });
    setRoom({ alias: "", roomNum: "" }); // Reset cost and year
    setCreateRoomOpen(false); // Close modal
  };

  const handleRoomInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoomData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSolutionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setSolutionData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Solution Profile
        </h1>
      </div>
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <h2 className="col-span-6 text-lg font-semibold text-slate-900">
          Room Information
        </h2>
        {/* Ministry */}
        <div className="sm:col-span-3">
          <FormInput
            id="ministry"
            label="Ministry"
            name="ministry"
            type="text"
            value={roomData?.ministry || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Ministry"
          />
        </div>

        {/* Division */}
        <div className="sm:col-span-3">
          <FormInput
            id="division"
            label="Division"
            name="division"
            type="text"
            value={roomData?.division || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Division"
          />
        </div>

        {/* Branch/Site Name */}
        <div className="sm:col-span-3">
          <FormInput
            id="branchSiteName"
            label="Branch/Site Name"
            name="branchSiteName"
            type="text"
            value={roomData?.branchSiteName || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Branch/Site Name"
          />
        </div>

        {/* City */}
        <div className="sm:col-span-3">
          <FormInput
            id="city"
            label="City"
            name="city"
            type="text"
            value={roomData?.city || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter City"
          />
        </div>

        {/* Street Address */}
        <div className="sm:col-span-3">
          <FormInput
            id="streetAddress"
            label="Street Address"
            name="streetAddress"
            type="text"
            value={roomData?.streetAddress || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Street Address"
          />
        </div>

        {/* Floor */}
        <div className="sm:col-span-3">
          <FormInput
            id="floor"
            label="Floor"
            name="floor"
            type="text"
            value={roomData?.floor || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Floor"
          />
        </div>

        {/* Room Number */}
        <div className="sm:col-span-3">
          <FormInput
            id="roomNumber"
            label="Room Number"
            name="roomNumber"
            type="text"
            value={roomData?.roomNumber || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Room Number"
          />
        </div>

        {/* Postal Code */}
        <div className="sm:col-span-3">
          <FormInput
            id="postalCode"
            label="Postal Code"
            name="postalCode"
            type="text"
            value={roomData?.postalCode || ""}
            onChange={handleRoomInputChange}
            placeholder="Enter Postal Code"
          />
        </div>

        {/* Business Region */}
        <div className="sm:col-span-3">
          <FormSelect
            id="businessRegion"
            label="Business Region"
            name="businessRegion"
            value={roomData?.businessRegion || ""}
            onChange={handleRoomInputChange}
            options={businessRegion}
          />
        </div>

        {/* Building Type */}
        <div className="sm:col-span-3">
          <FormSelect
            id="buildingType"
            label="Building Type"
            name="buildingType"
            value={roomData?.buildingType || ""}
            onChange={handleRoomInputChange}
            options={buildingTypes}
          />
        </div>

        {/* Hours of Operation */}
        <div className="sm:col-span-3">
          <FormSelect
            id="hoursOfOperation"
            label="Hours of Operation"
            name="hoursOfOperation"
            value={roomData?.hoursOfOperation || ""}
            onChange={handleRoomInputChange}
            options={hoursOfOperations}
          />
        </div>

        <h2 className="col-span-6 text-lg font-semibold text-slate-900">
          Summary of JVN Solution
        </h2>

        {/* Site Alias */}
        <div className="sm:col-span-3">
          <FormInput
            id="siteAlias"
            label="Site Alias"
            name="siteAlias"
            type="text"
            value={solutionData?.siteAlias || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Site Alias"
          />
        </div>

        {/* Codec Alias */}
        <div className="sm:col-span-3">
          <FormInput
            id="codecAlias"
            label="Codec Alias"
            name="codecAlias"
            type="text"
            value={solutionData?.codecAlias || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Codec Alias"
          />
        </div>

        {/* System Name */}
        <div className="sm:col-span-3">
          <FormInput
            id="systemName"
            label="System Name"
            name="systemName"
            type="text"
            value={solutionData?.systemName || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter System Name"
          />
        </div>

        {/* Support Level */}
        <div className="sm:col-span-3">
          <FormSelect
            id="supportLevel"
            label="Support Level"
            name="supportLevel"
            value={solutionData?.supportLevel || ""}
            onChange={handleSolutionInputChange}
            options={supportLevel}
          />
        </div>

        {/* Level of Court */}
        <div className="sm:col-span-3">
          <FormSelect
            id="levelOfCourt"
            label="Level of Court"
            name="levelOfCourt"
            value={solutionData?.levelOfCourt || ""}
            onChange={handleSolutionInputChange}
            options={levelOfCourt}
          />
        </div>

        {/* Solution Type */}
        <div className="sm:col-span-3">
          <FormSelect
            id="solutionType"
            label="Solution Type"
            name="solutionType"
            value={solutionData?.solutionType || ""}
            onChange={handleSolutionInputChange}
            options={solutionType}
          />
        </div>

        {/* Solution Type If Other */}
        <div className="sm:col-span-3">
          <FormInput
            id="solutionTypeIfOther"
            label="Solution Type If Other"
            name="solutionTypeIfOther"
            type="text"
            value={solutionData?.solutionTypeIfOther || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Solution Type If Other"
          />
        </div>

        {/* Room Function */}
        <div className="sm:col-span-3">
          <FormSelect
            id="roomFunction"
            label="Room Function"
            name="roomFunction"
            value={solutionData?.roomFunction || ""}
            onChange={handleSolutionInputChange}
            options={roomFunction}
          />
        </div>

        {/* Room Function If Other */}
        <div className="sm:col-span-3">
          <FormInput
            id="roomFunctionIfOther"
            label="Room Function If Other"
            name="roomFunctionIfOther"
            type="text"
            value={solutionData?.roomFunctionIfOther || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Room Function If Other"
          />
        </div>

        {/* Secondary Room Functions */}
        <div className="sm:col-span-3">
          <FormSelect
            id="secondaryRoomFunctions"
            label="Secondary Room Functions"
            name="secondaryRoomFunctions"
            value={solutionData?.secondaryRoomFunctions || ""}
            onChange={handleSolutionInputChange}
            options={roomFunction}
          />
        </div>

        <h2 className="col-span-6 text-lg font-semibold text-slate-900">
          Enabled System Functionality
        </h2>

        <div className="sm:col-span-6">
          <h3 className="">Features</h3>
          <div className="flex space-x-4 mt-3">
            {solutionData?.features?.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature.id)} // 呼叫移除方法
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="pr-3 py-1.5">{feature.feature}</div>
              </div>
            ))}
            <a
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => setAddFeatureOpen(true)}
            >
              + Add Feature
            </a>
            {/* Modal For Adding Features*/}
            <Modal
              open={addFeatureOpen}
              onClose={() => {
                setAddFeatureOpen(false);
              }}
              title="Add Features"
              content={
                <div>
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onChange={() => handleToggleFeature(feature.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={feature.id}
                        className="ml-2 text-gray-900"
                      >
                        {feature.feature}
                      </label>
                    </div>
                  ))}
                </div>
              }
              confirmLabel="Save"
              confirmAction={handleSaveFeatures}
              cancelLabel="Cancel"
            />
          </div>
        </div>

        {/* System Control Type */}
        <div className="sm:col-span-3">
          <FormSelect
            id="systemCtrlType"
            label="System Control Type"
            name="systemCtrlType"
            value={solutionData?.systemCtrlType || ""}
            onChange={handleSolutionInputChange}
            options={systemControlType}
          />
        </div>

        {/* Audio Conference Phone Number */}
        <div className="sm:col-span-3">
          <FormInput
            id="audioConfePhoneNum"
            label="Audio Conference Phone Number [10 digits]"
            name="audioConfePhoneNum"
            type="text"
            value={solutionData?.audioConfePhoneNum || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Audio Conference Phone Number"
          />
        </div>

        {/* Privacy Number */}
        <div className="sm:col-span-3">
          <FormInput
            id="privacyNum"
            label="Privacy Number [10 digits]"
            name="privacyNum"
            type="text"
            value={solutionData?.privacyNum || ""}
            onChange={handleSolutionInputChange}
            placeholder="Enter Privacy Number"
          />
        </div>
        <div className="sm:col-span-3"></div>

        {/* Local Connectivity Rooms */}
        <div className="sm:col-span-6">
          <h3 className="">Local Connectivity Rooms</h3>
          <div className="mt-2 overflow-y-auto max-h-36 outline outline-gray-100 rounded-sm">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Alias
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Room #
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {solutionData.localConnecRooms?.length > 0 ? (
                  solutionData.localConnecRooms.map((room) => (
                    <tr key={room.roomNum}>
                      <td className="px-3 py-3.5 text-sm text-gray-900">
                        {room.alias}
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-900">
                        {room.roomNum}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-3.5 text-sm text-gray-500 text-center"
                    >
                      There is no local connectivity rooms now
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right text-sky-500 hover:text-sky-700">
            <a href="#" onClick={() => setCreateRoomOpen(true)}>
              + Add Room
            </a>
          </div>

          {/* Modal For Adding Local Connectivity Rooms*/}
          <Modal
            open={createRoomOpen}
            onClose={() => {
              setCreateRoomOpen(false);
            }}
            title="Add Local Connectivity Room"
            content={
              <div>
                {/* Error Message */}
                {roomInputError && (
                  <div className="text-red-500 text-sm mb-2">
                    {roomInputError}
                  </div>
                )}
                <div className="mb-4">
                  <FormInput
                    id="alias"
                    label="Alias"
                    name="alias"
                    type="text"
                    placeholder="Enter Alias"
                    onChange={(e) =>
                      setRoom((prevState) => ({
                        ...prevState,
                        alias: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <FormInput
                    id="roomNum"
                    label="Room Number"
                    name="roomNum"
                    type="text"
                    placeholder="Enter Room Number"
                    onChange={(e) =>
                      setRoom((prevState) => ({
                        ...prevState,
                        roomNum: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            }
            confirmLabel="Save"
            confirmAction={handleSaveRoom}
            cancelLabel="Cancel"
          />
        </div>
      </form>
      <hr className="my-6 border-t border-gray-300" />
      <div className="flex mt-10 justify-end">
        <div className="">
          <button className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Cancel
          </button>
        </div>
        <div className="">
          <button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSolutionPage;
