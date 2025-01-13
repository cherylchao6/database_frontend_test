"use client";
import React, { useState } from "react";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormMultipleCheckbox from "./FormMultipleCheckbox";
import Modal from "@/components/Modal";
import { Room } from "@/types/intakes/room";
import { Solution } from "@/types/intakes/solution";
import { XMarkIcon } from "@heroicons/react/24/outline";
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
import { useRouter } from "next/navigation";

const versions = [
  "archived-MAG-516-B+-67",
  "archived-MAG-516-B+-68",
  "planned-MAG-516-B+-69",
];

interface RoomSolutionFormProps {
  initialRoomData: Room;
  initialSolutionData: Solution;
  isEditMode?: boolean; // To determine if the form is in edit mode or create mode
  onSave: (roomData: Room, solutionData: Solution) => void;
}

const RoomSolutionForm: React.FC<RoomSolutionFormProps> = ({
  initialRoomData,
  initialSolutionData,
  isEditMode = false,
  onSave,
}) => {
  const user = {
    id: "1",
    name: "John Doe",
    role: "no",
  };
  const canAddFeature = user.role === "pm";
  const router = useRouter();
  const [roomData, setRoomData] = useState(initialRoomData);
  const [solutionData, setSolutionData] = useState(initialSolutionData);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() =>
    initialSolutionData.features.map((feature) => feature.id)
  );
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>(
    initialSolutionData.roomFunction
  );
  const [addFeatureOpen, setAddFeatureOpen] = useState(false);
  const [addFunctionOpen, setAddFunctionOpenState] = useState(false);
  const [createLocalConnRoomOpen, setCreateLocalConnRoomOpen] = useState(false);
  const [connRoomInputError, setConnRoomInputError] = useState<string | null>(
    null
  );
  const [connRoom, setConnRoom] = useState<{ alias: string; roomNum: string }>({
    alias: "",
    roomNum: "",
  });

  const [selectedLevelOfCourt, setSelectedLevelOfCourt] = useState<string[]>(
    initialSolutionData.levelOfCourt
  );

  const handleLevelOfCourtChange = (selected: string[]) => {
    setSelectedLevelOfCourt(selected);
  };

  const handleSaveLocalConnRoom = () => {
    if (connRoom.alias === "" || connRoom.roomNum === "") {
      setConnRoomInputError("* Please enter both alias and room number.");
      return;
    }
    setConnRoomInputError(null); // Clear error message

    setSolutionData((prevState) => {
      return {
        ...prevState,
        localConnecRooms: [
          { alias: connRoom.alias, roomNum: connRoom.roomNum },
          ...(prevState.localConnecRooms || []),
        ],
      };
    });

    setConnRoom({ alias: "", roomNum: "" });
    setCreateLocalConnRoomOpen(false); // Close modal
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: "room" | "solution"
  ) => {
    const { name, value } = e.target;

    if (type === "room") {
      setRoomData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSolutionData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleSaveAndRedirect = () => {
    onSave(roomData, solutionData);
    router.push("/dashboard/intake/projects/MAG-516-B+-67");
  };

  const handleToggleFunction = (func: string) => {
    if (selectedFunctions.includes(func)) {
      setSelectedFunctions((prev) => prev.filter((f) => f !== func));
    } else {
      setSelectedFunctions((prev) => [...prev, func]);
    }
  };

  const handleSaveFunctions = () => {
    const updatedFunctions = roomFunction.filter((func) =>
      selectedFunctions.includes(func)
    );

    setSolutionData((prev) => ({
      ...prev,
      roomFunction: updatedFunctions,
    }));

    setAddFunctionOpenState(false);
  };

  function handleRemoveFunction(func: string): void {
    const updatedFunctions = selectedFunctions.filter((f) => f !== func);
    setSelectedFunctions(updatedFunctions);
    setSolutionData((prev) => ({ ...prev, roomFunction: updatedFunctions }));
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Solution Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900 my-2">
            Solution Version
          </h2>
          <FormSelect
            id="version"
            label=""
            name="version"
            value={""}
            options={versions}
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Room Information */}
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
            disabled
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
            disabled
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
            disabled
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
            disabled
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
            disabled
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
            disabled
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
            onChange={(e) => handleInputChange(e, "room")}
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
            onChange={(e) => handleInputChange(e, "room")}
            placeholder="Enter Room Number"
          />
        </div>

        {/* Business Region */}
        <div className="sm:col-span-3">
          <FormSelect
            id="businessRegion"
            label="Business Region"
            name="businessRegion"
            value={roomData?.businessRegion || ""}
            onChange={(e) => handleInputChange(e, "room")}
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
            onChange={(e) => handleInputChange(e, "room")}
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
            onChange={(e) => handleInputChange(e, "room")}
            options={hoursOfOperations}
          />
        </div>
      </div>

      {/* Solution Information */}
      <h2 className="mt-10 col-span-6 text-lg font-semibold text-slate-900">
        Summary of JVN Solution
      </h2>
      {/* Site Alias */}
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <FormInput
            id="siteAlias"
            label="Site Alias"
            name="siteAlias"
            type="text"
            value={solutionData?.siteAlias || ""}
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
            options={supportLevel}
          />
        </div>

        {/* Level of Court */}
        <div className="sm:col-span-6">
          <FormMultipleCheckbox
            label="Level of Court"
            options={levelOfCourt}
            selectedValues={selectedLevelOfCourt}
            onChange={handleLevelOfCourtChange}
          />
        </div>

        {/* Solution Type */}
        <div className="sm:col-span-3">
          <FormSelect
            id="solutionType"
            label="Solution Type"
            name="solutionType"
            value={solutionData?.solutionType || ""}
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
            placeholder="Enter Solution Type If Other"
          />
        </div>

        {/* Room Function */}
        <div className="sm:col-span-6">
          {/* <FormMultipleCheckbox
            label="Room Function"
            options={roomFunction}
            selectedValues={solutionData?.roomFunction || []}
            onChange={(selected) =>
              setSolutionData((prev) => ({ ...prev, roomFunction: selected }))
            }
          /> */}
          <h3 className="">Room Functions</h3>
          <div className="flex space-x-4 mt-3">
            {solutionData?.roomFunction?.map((func) => (
              <div
                key={func}
                className="flex items-center text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveFunction(func)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="pr-3 py-1.5">{func}</div>
              </div>
            ))}
            <a
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => setAddFunctionOpenState(true)}
            >
              + Add Function
            </a>
          </div>

          {/* Modal For Adding Functions*/}
          <Modal
            open={addFunctionOpen}
            onClose={() => {
              setAddFunctionOpenState(false);
            }}
            title="Add Room Functions"
            content={
              <div>
                {roomFunction.map((func) => (
                  <div key={func} className="flex items-center">
                    <input
                      type="checkbox"
                      id={func}
                      checked={selectedFunctions?.includes(func)}
                      onChange={() => handleToggleFunction(func)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={func} className="ml-2 text-gray-900">
                      {func}
                    </label>
                  </div>
                ))}
              </div>
            }
            confirmLabel="Save"
            confirmAction={handleSaveFunctions}
            cancelLabel="Cancel"
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
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
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
                {canAddFeature && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature.id)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
                <div className={`pr-3 py-1.5 ${!canAddFeature ? "pl-3" : ""}`}>
                  {feature.feature}
                </div>
              </div>
            ))}
            {
              // Add Feature Button
              canAddFeature && (
                <a
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => setAddFeatureOpen(true)}
                >
                  + Add Feature
                </a>
              )
            }

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
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
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
            onChange={(e) => handleInputChange(e, "solution")}
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
            <a href="#" onClick={() => setCreateLocalConnRoomOpen(true)}>
              + Add Room
            </a>
          </div>

          {/* Modal For Adding Local Connectivity Rooms*/}
          <Modal
            open={createLocalConnRoomOpen}
            onClose={() => {
              setCreateLocalConnRoomOpen(false);
            }}
            title="Add Local Connectivity Room"
            content={
              <div>
                {/* Error Message */}
                {connRoomInputError && (
                  <div className="text-red-500 text-sm mb-2">
                    {connRoomInputError}
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
                      setConnRoom((prevState) => ({
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
                      setConnRoom((prevState) => ({
                        ...prevState,
                        roomNum: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            }
            confirmLabel="Save"
            confirmAction={handleSaveLocalConnRoom}
            cancelLabel="Cancel"
          />
        </div>
      </div>

      <hr className="my-6 border-t border-gray-300" />
      <div className="flex mt-10 justify-end">
        <div className="">
          <button
            onClick={() =>
              router.push("/dashboard/intake/projects/MAG-516-B+-67")
            }
            className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
        <div className="">
          <button
            onClick={handleSaveAndRedirect}
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSolutionForm;
