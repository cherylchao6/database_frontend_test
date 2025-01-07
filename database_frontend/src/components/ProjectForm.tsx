"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BuildingLibraryIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicSearchPeopleListbox from "@/components/DynamicSearchPeopleListbox";
import Modal from "@/components/Modal";
import { Person } from "@/types/intakes/person";
import { Project } from "@/types/intakes/project";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormDate from "@/components/FormDate";
import FormCheckbox from "@/components/FormCheckbox";
import LocationSearch from "@/components/LocationSearch";
import ResponsiveDropdowns from "@/components/OrgResponsiveDropdowns";
import MilestonesComponent from "@/components/MilestonesComponent";
import {
  priorityOptions,
  statusOptions,
  waitingOnContactOptions,
  waitingForOptions,
  intakeFormStatusOptions,
  clientMinistryOptions,
  fundingSourceOptions,
} from "constants/intake/dropDownOptions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Location {
  id: number;
  name: string;
  address: string;
}

// Convert to 'YYYY-MM-DD' format
const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

interface ProjectFormProps {
  initialProjectData: Project;
  isEditMode: boolean;
  onSave: (projectData: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialProjectData,
  isEditMode,
  onSave,
}) => {
  const router = useRouter();

  const projectId = isEditMode ? initialProjectData.projectId : "";
  const [projectData, setProjectData] = useState<Project>(initialProjectData);
  const [assignedTo, setAssignedTo] = useState<Person[]>(
    initialProjectData.assignedTo ? [initialProjectData.assignedTo] : []
  );
  const [clientContacts, setClientContacts] = useState<Person[]>(
    initialProjectData.clientContacts || []
  );

  const [selectedLocation, setSelectedLocation] = useState(
    initialProjectData.locationName || ""
  );
  const [address, setAddress] = useState(initialProjectData.address || "");

  const [assocReferenceNoTags, setAssocReferenceNoTags] = useState<string[]>(
    initialProjectData.assocReferenceNo || []
  );
  const [referenceNoInput, setReferenceNoInput] = useState("");

  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const [ministry, setMinistry] = useState<string>(
    initialProjectData.ministry || ""
  );
  const [division, setDivision] = useState<string>(
    initialProjectData.division || ""
  );
  const [branch, setBranch] = useState<string>(
    initialProjectData.branchUnit || ""
  );

  const [createCostOpen, setCreateCostOpen] = useState(false);
  const [cost, setCost] = useState<{
    cost: number | null;
    year: number | null;
  }>({
    cost: null,
    year: null,
  });
  const [costInputError, setCostInputError] = useState<string | null>(null);

  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestones, setMilestones] = useState<Record<string, any>>({}); // 用于保存 Milestones 数据

  // available rooms for the location
  // TODO::should call api in the future
  const [selectedRoom, setSelectedRoom] = useState("");
  const availableRooms: { id: string; num: string }[] = [
    { id: "000001", num: "Ctrm401" },
    { id: "000002", num: "Ctrm402" },
    { id: "000003", num: "Ctrm403" },
    { id: "000004", num: "Ctrm404" },
  ];

  const availableRoomOptions = availableRooms.filter(
    (room) => !projectData?.rooms?.some((r) => r.id === room.id)
  );

  /*Fetch Functions*/
  const fetchUsersFromApi = async (query: string) => {
    const response = await fetch(`${apiUrl}/users?name=${query}`);
    return await response.json(); // Returns the people data
  };

  /* Handel Functions */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;
    // Handle the case where the input is a checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProjectData((prevState) => {
        return {
          ...prevState,
          [name]: checked, // Update the boolean value for checkboxes
        };
      });
    } else if (name === "notes") {
      if (!value) return; // Prevent empty notes from being added
      setProjectData((prevState) => {
        return {
          ...prevState,
          noteLog: [
            {
              description: value,
              user: "test user",
              timestamp: new Date().toISOString(),
            },
            ...prevState.noteLog,
          ],
        };
      });
    } else {
      // Handle other input types (text, textarea, select)
      setProjectData((prevState) => ({
        ...prevState,
        [name]: value, // Update the value for other inputs
      }));
    }
  };

  const handleSave = () => {
    onSave({
      ...projectData,
      assignedTo: assignedTo[0],
      clientContacts,
      locationName: selectedLocation,
      address,
    });

    router.push("/dashboard/intake/projects");
  };

  const addReferenceNoTag = () => {
    if (
      referenceNoInput.trim() &&
      !assocReferenceNoTags.includes(referenceNoInput.trim())
    ) {
      setAssocReferenceNoTags([
        ...assocReferenceNoTags,
        referenceNoInput.trim(),
      ]);
    }
    setReferenceNoInput(""); // Clear the input field
  };

  const removeReferenceNoTag = (tagToRemove: string) => {
    setAssocReferenceNoTags(
      assocReferenceNoTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addReferenceNoTag();
    }
  };

  const handleLocationSelect = (location: Location | null) => {
    if (location) {
      setSelectedLocation(location.name);
      setAddress(location.address);
    } else {
      setSelectedLocation("");
      setAddress("");
    }
    // work around, need to figure out where to use addrerss variable
    console.log(address);
  };

  const handleMinistryChange = (selectedMinistry: string) => {
    setMinistry(selectedMinistry);
  };

  const handleDivisionChange = (selectedDivision: string) => {
    setDivision(selectedDivision);
  };

  const handleBranchChange = (selectedBranch: string) => {
    setBranch(selectedBranch);
  };

  const handleSaveCost = () => {
    // Check if cost or year is null
    if (cost.cost === null || cost.year === null) {
      setCostInputError("* Please enter both cost and year.");
      return;
    }

    // Since cost.cost and cost.year are numbers, no need to parse them as strings.
    const parsedCost = cost.cost; // No need to parse if already a number
    const parsedYear = cost.year; // No need to parse if already a number

    // Ensure cost and year are valid
    if (isNaN(parsedCost) || isNaN(parsedYear)) {
      setCostInputError(
        "* Please enter valid numerical values for both cost and year."
      );
    } else {
      setCreateCostOpen(false); // Close modal
      setCostInputError(null); // Clear error message
      setProjectData((prevState) => {
        return {
          ...prevState,
          estimatedCost: [
            { cost: parsedCost, year: parsedYear },
            ...(prevState.estimatedCost || []),
          ],
        };
      });
      setCost({ cost: null, year: null }); // Reset cost and year
    }
  };

  const handleSaveMilestones = async () => {
    try {
      // const response = await fetch(`/api/projects/${projectId}/milestones`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(milestones),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save milestones");
      // }
      // alert("Milestones saved successfully!");
      setMilestoneOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleAddRoom = () => {
    if (selectedRoom) {
      const roomToAdd = availableRooms.find((room) => room.id === selectedRoom);
      if (roomToAdd) {
        setProjectData((prev) => ({
          ...prev,
          rooms: [...(prev.rooms || []), roomToAdd],
        }));
        setSelectedRoom(""); // 重置選擇
      }
    }
  };

  function handleRemoveRoom(id: string): void {
    setProjectData((prev) => ({
      ...prev,
      rooms: prev.rooms?.filter((r) => r.id !== id),
    }));
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Project Intake Update
        </h1>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Project ID */}
        <div className="sm:col-span-3">
          <FormInput
            id="projectId"
            label="Project ID"
            name="projectId"
            type="text"
            value={projectData?.projectId || ""}
            onChange={handleInputChange}
            placeholder="Enter project ID"
          />
        </div>

        {/* Project Name */}
        <div className="sm:col-span-3">
          <FormInput
            id="projectName"
            label="Project Name"
            name="projectName"
            type="text"
            value={projectData?.projectName || ""}
            onChange={handleInputChange}
            placeholder="Enter project name"
          />
        </div>

        {/* Project Short Description */}
        <div className="sm:col-span-6">
          <FormInput
            id="projectDescription"
            label="Project Short Description"
            name="projectDescription"
            type="text"
            value={projectData?.projectDescription || ""}
            onChange={handleInputChange}
            placeholder="Enter project short description"
          />
        </div>

        {/* Priority */}
        <div className="sm:col-span-3">
          <FormSelect
            id="priority"
            name="priority"
            value={projectData?.priority || ""}
            onChange={handleInputChange}
            options={priorityOptions}
            label="Priority"
          />
        </div>

        {/* On Opp. List? */}
        <div className="mt-8 flex items-center sm:col-span-3">
          <FormCheckbox
            id="onOppList"
            name="onOppList"
            label="On Opp. List ?"
            checked={projectData?.onOppList || false}
            onChange={handleInputChange}
          />
        </div>

        {/* Deadline */}
        <div className="sm:col-span-3">
          <FormDate
            id="deadline"
            label="Deadline"
            name="deadline"
            inputClassName="pr-2"
            value={projectData?.deadline || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* First Contact Date */}
        <div className="sm:col-span-3">
          <FormDate
            id="firstContactDate"
            label="First Contact Date"
            name="firstContactDate"
            inputClassName="pr-2"
            value={projectData?.firstContactDate || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Status */}
        <div className="sm:col-span-3">
          <FormSelect
            id="status"
            name="status"
            label="Status"
            value={projectData?.status || ""}
            onChange={handleInputChange}
            options={statusOptions}
          />
        </div>

        {/* implemented */}
        <div className="mt-8 flex items-center sm:col-span-3">
          <FormCheckbox
            id="implemented"
            name="implemented"
            label="In Implementation Phase ?"
            checked={projectData?.implemented || false}
            onChange={handleInputChange}
          />
        </div>

        {/* Alias */}
        <div className="sm:col-span-3">
          <FormInput
            id="alias"
            label="Alias"
            name="alias"
            type="text"
            value={projectData?.alias || ""}
            onChange={handleInputChange}
            placeholder="Enter alias"
          />
        </div>
        <div className="sm:col-span-3"></div>

        {/* Waiting On Contact(s) */}
        <div className="sm:col-span-3">
          <FormSelect
            id="waitingOnContact"
            name="waitingOnContact"
            label="Waiting on Contact(s)"
            value={projectData?.waitingOnContact || ""}
            onChange={handleInputChange}
            options={waitingOnContactOptions}
          />
        </div>

        {/* Waiting For */}
        <div className="sm:col-span-3">
          <FormSelect
            id="waitingFor"
            name="waitingFor"
            label="Waiting For"
            value={projectData?.waitingFor || ""}
            onChange={handleInputChange}
            options={waitingForOptions}
          />
        </div>

        {/* Assigned To */}
        <div className="sm:col-span-3">
          <DynamicSearchPeopleListbox
            label="Assigned To"
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
            fetchOptions={fetchUsersFromApi}
          />
        </div>

        {/* Client Ministry */}
        <div className="sm:col-span-3">
          <FormSelect
            id="clientMinistry"
            name="clientMinistry"
            label="Client Ministry"
            value={projectData?.clientMinistry || ""}
            onChange={handleInputChange}
            options={clientMinistryOptions}
          />
        </div>

        {/* Folder Name */}
        <div className="sm:col-span-3">
          <FormInput
            id="folderName"
            label="Folder Name (if exist)"
            name="folderName"
            type="text"
            value={projectData?.folderName || ""}
            onChange={handleInputChange}
            placeholder="Enter folder name"
          />
        </div>

        {/* Intake From Status */}
        <div className="sm:col-span-3">
          <FormSelect
            id="intakeFormStatus"
            name="intakeFormStatus"
            label="Intake From Status"
            value={projectData?.intakeFormStatus || ""}
            onChange={handleInputChange}
            options={intakeFormStatusOptions}
          />
        </div>

        {/* Last Communication (Out Bound) */}
        <div className="sm:col-span-3">
          <FormDate
            id="lastComm"
            label="Last Comm. (Outbound)"
            name="lastComm"
            inputClassName="pr-2"
            value={projectData?.lastComm || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Client Contacts */}
        <div className="sm:col-span-3">
          <DynamicSearchPeopleListbox
            label="Client Contacts"
            assignedTo={clientContacts}
            setAssignedTo={setClientContacts}
            fetchOptions={fetchUsersFromApi}
            allowMultiple={true}
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="assocReferenceNo"
            className="block font-medium leading-6 text-gray-900 mb-2"
          >
            Assoc Reference No.
          </label>

          <div className="flex items-center">
            <input
              type="text"
              value={referenceNoInput}
              onChange={(e) => setReferenceNoInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add reference number"
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              onClick={addReferenceNoTag}
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 ">
            {assocReferenceNoTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 flex items-center text-gray-900 bg-gray-100 rounded hover:bg-gray-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeReferenceNoTag(tag)}
                  className="ml-2 text-gray-900 hover:bg-gray-200 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Funding Source */}
        <div className="sm:col-span-3">
          <FormSelect
            id="fundingSource"
            name="fundingSource"
            label="Funding Source"
            value={projectData?.fundingSource || ""}
            onChange={handleInputChange}
            options={fundingSourceOptions}
          />
        </div>

        {/* Note Log */}
        <div className="sm:col-span-6">
          <h3 className="">Note Logs</h3>
          <div className="mt-2 overflow-y-auto max-h-36 outline outline-gray-100 rounded-sm">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectData?.noteLog?.length > 0 ? (
                  projectData.noteLog.map((note, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {note.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {note.user}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatTimestamp(note.timestamp)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-3.5 text-sm text-gray-500 text-center"
                    >
                      There is no note log.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right text-sky-500 hover:text-sky-700">
            <a href="#" onClick={() => setCreateNoteOpen(true)}>
              + Add Notes
            </a>
          </div>
        </div>

        {/* Create New Notes Modal */}
        <Modal
          open={createNoteOpen}
          onClose={setCreateNoteOpen}
          title="Create Note"
          content={
            <div>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="block w-full p-2 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Write something..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          }
          confirmLabel="Save"
          confirmAction={() => {
            handleInputChange({
              target: { name: "notes", value: notes },
            } as any);
            setNotes("");
            setCreateNoteOpen(false);
          }}
          cancelLabel="Cancel"
          cancelAction={() => setNotes("")}
        />

        <div className="sm:col-span-6">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            initialLocationName={selectedLocation ?? undefined}
          />
        </div>

        {/* Rooms */}
        <div className="sm:col-span-6">
          <h3 className="">Rooms</h3>
          <div className="flex">
            <div className="flex items-center mt-1 w-3/6">
              {availableRoomOptions.length > 0 ? (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="mr-2 px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>
                    Select a room to add
                  </option>
                  {availableRoomOptions.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.num}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-500 mr-2">
                  No available rooms for the location now.
                </span>
              )}

              <button
                onClick={handleAddRoom}
                disabled={!selectedRoom}
                className={`whitespace-nowrap items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !selectedRoom ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Add Room
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm text-red-600">
            * Please click on each room to view solution profile.
          </p>
          <div className="flex space-x-4 mt-3">
            {projectData?.rooms?.length ? (
              projectData.rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveRoom(room.id)}
                    className="mr-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  {/* Room Link */}
                  <a
                    href={`/dashboard/intake/rooms/${room.id}`}
                    className="flex items-center"
                  >
                    <BuildingLibraryIcon className="h-5 w-5 mr-1.5" />
                    {room.num}
                  </a>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500 py-1.5">No rooms</span>
            )}
          </div>
        </div>

        {/* Project Sponsor */}
        <div className="sm:col-span-3">
          <FormInput
            id="projectSponsor"
            label="Project Sponsor"
            name="projectSponsor"
            type="text"
            value={projectData?.projectSponsor || ""}
            onChange={handleInputChange}
            placeholder="Enter project sponsor"
          />
        </div>

        {/* Ministry, Division, Branch */}
        <div className="sm:col-span-6">
          <ResponsiveDropdowns
            initialMinistry={ministry}
            initialDivision={division}
            initialBranch={branch}
            onChangeMinistry={handleMinistryChange}
            onChangeDivision={handleDivisionChange}
            onChangeBranch={handleBranchChange}
          />
        </div>

        {/* Requested Completion Date */}
        <div className="sm:col-span-3">
          <FormDate
            id="requestedCompletionDate"
            label="Requested Completion Date"
            name="requestedCompletionDate"
            inputClassName="pr-2"
            value={projectData?.requestedCompletionDate || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Assigned to PM */}
        <div className="mt-8 flex items-center sm:col-span-3">
          <FormCheckbox
            id="assignedToPM"
            name="assignedToPM"
            label="Assigned to PM"
            checked={projectData?.assignedToPM ? true : false}
            onChange={handleInputChange}
          />
        </div>

        {/* Estimated Cost */}
        <div className="sm:col-span-2">
          <h3 className="">Estimated Cost/Fiscal Year</h3>
          <div className="mt-2 overflow-y-auto max-h-36 outline outline-gray-100 rounded-sm">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Year
                  </th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectData?.estimatedCost &&
                projectData.estimatedCost.length > 0 ? (
                  projectData.estimatedCost.map((data, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                        {data.year}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                        ${data.cost}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-3 py-4 text-sm text-gray-500 text-center"
                    >
                      There is no Cost/Fiscal record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right text-sky-500 hover:text-sky-700">
            <a onClick={() => setCreateCostOpen(true)}>
              + Add Cost / Fiscal Year
            </a>
          </div>
        </div>

        {/* Create New Cost Modal */}
        <Modal
          open={createCostOpen}
          onClose={() => {
            setCreateCostOpen(false);
            setCostInputError(null);
          }}
          title="Create Cost/Fiscal"
          content={
            <div>
              {/* Error Message */}
              {costInputError && (
                <div className="text-red-500 text-sm mb-2">
                  {costInputError}
                </div>
              )}

              {/* Cost Input */}
              <div className="mt-4">
                <label
                  htmlFor="cost"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cost
                </label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  value={cost.cost ?? ""}
                  onChange={(e) =>
                    setCost((prev) => ({
                      ...prev,
                      cost: parseFloat(e.target.value),
                    }))
                  }
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter cost"
                />
              </div>

              {/* Year Input */}
              <div className="mt-4">
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={cost.year ?? ""}
                  onChange={(e) =>
                    setCost((prev) => ({
                      ...prev,
                      year: parseInt(e.target.value),
                    }))
                  }
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter fiscal year"
                />
              </div>
            </div>
          }
          confirmLabel="Save"
          confirmAction={handleSaveCost}
          cancelLabel="Cancel"
          cancelAction={() => {
            setCostInputError(null);
            setCost({ cost: null, year: null });
          }}
        />
      </div>

      <div className="flex mt-10">
        <div>
          <a
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setMilestoneOpen(true)}
          >
            Milestones
          </a>

          {/* Milestone Modal */}
          <Modal
            open={milestoneOpen}
            onClose={setMilestoneOpen}
            title="Milestones"
            confirmLabel="Save"
            confirmAction={handleSaveMilestones}
            cancelLabel="Cancel"
            cancelAction={() => setMilestoneOpen(false)}
            content={
              <MilestonesComponent
                projectId={projectId}
                milestones={milestones}
                setMilestones={setMilestones}
              />
            }
          />
        </div>

        <div>
          <a
            href="/dashboard/intake/requisitionOrders"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Requisition Orders
          </a>
        </div>
      </div>

      <hr className="my-6 border-t border-gray-300" />

      <div className="flex justify-between">
        <div>
          <a
            href="/dashboard/intake/projects"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Projects
          </a>
        </div>
        <div className="flex justify-end">
          <div className="">
            <button
              onClick={() => router.push("/dashboard/intake/projects")}
              className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
          <div className="">
            <a
              onClick={handleSave}
              className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
