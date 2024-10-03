"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Hourglass } from "react-loader-spinner";
import { XCircleIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import DynamicSearchListbox from "@/components/DynamicSearchListbox";
import Modal from "@/components/Modal";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import {
  priorityOptions,
  statusOptions,
  waitingOnContactOptions,
  waitingForOptions,
  intakeFormStatusOptions,
  clientMinistryOptions,
  fundingSourceOptions,
} from "constants/intake/dropDownOptions";

const labelClassName = "block text-m font-medium leading-6 text-gray-900";
const inputClassName =
  "pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

interface Person {
  id: number;
  name: string;
  avatar: string;
}

interface ProjectData {
  projectId: string;
  projectName: string;
  projectDescription: string;
  priority: string;
  onOppList: boolean;
  deadline: string;
  firstContactDate: string;
  alias: string;
  status: string;
  implemented: boolean;
  waitingOnContact: string;
  waitingFor: string;
  assignedTo: Person;
  clientMinistry: string;
  folderName: string;
  intakeFormStatus: string;
  lastComm: string;
  clientContacts: Person[];
  assocReferenceNo: string;
  fundingSource: string;
  notes: string;
  noteLog: { description: string; user: string; timestamp: string }[];
  locationName: string;
  address: string;
  rooms: { id: string; num: string }[];
  projectSponsor: string;
  ministry: string;
  division: string;
  branchUnit: string;
  requestedCompletionDate: string;
  assignedToPM: string;
  confirmed: boolean;
  estimatedCost: { cost: number; year: number }[];
}

const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`; // Convert to 'YYYY-MM-DD' format
};

const formatDateForDisplay = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`; // Convert back to 'DD.MM.YYYY' format
};

const fetchUsersFromApi = async (query: string) => {
  const response = await fetch(`${apiUrl}/users?name=${query}`);
  console.log(response);
  return await response.json(); // Returns the people data
};

const UpdateProjectPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract project ID from route (e.g., MAG-001)
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<Person[]>([]);
  const [clientContacts, setClientContacts] = useState<Person[]>(
    projectData?.clientContacts ?? []
  );
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [createCostOpen, setCreateCostOpen] = useState(false);
  const [cost, setCost] = useState<{
    cost: number | null;
    year: number | null;
  }>({
    cost: null,
    year: null,
  });
  const [costInputError, setCostInputError] = useState<string | null>(null);

  // Fetch project data based on the project ID from the URL
  useEffect(() => {
    if (id) {
      fetchProjectData(id);
    }
  }, [id]);

  useEffect(() => {
    if (projectData?.assignedTo) {
      setAssignedTo([projectData.assignedTo]);
    } else {
      setAssignedTo([]);
    }
  }, [projectData?.assignedTo]);

  const fakeData: ProjectData = {
    projectId: id || "MAG-001", // Use the project ID from the URL
    projectName: "Super Fun Project", // Project Name
    projectDescription:
      "Project related to infrastructure improvements in Arizona.",
    priority: "Low",
    onOppList: true, // This is for the "On Opp List?" checkbox
    implemented: false, // This is for the "In Implementation Phase?" checkbox
    deadline: "2023-12-31", // As seen in your screenshot
    firstContactDate: "2023-12-31", // First Contact Date
    status: "035 - Pre-Intake assess. complete", // Status field
    alias: "TEST-002", // Alias field
    waitingOnContact: "John Doe", // Waiting on con Contact(s)
    waitingFor: "Approval from Stakeholder",
    assignedTo: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    clientMinistry: "Ministry of Infrastructure", // Client Ministry
    folderName: "Infra-Arizona-Docs", // Folder Name if exists
    intakeFormStatus: "Initial Discussion", // Intake from Status
    lastComm: "2023-12-31", // Last Communication (Out Bound)
    clientContacts: [
      {
        id: 3,
        name: "Devon Webb",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
      },
      {
        id: 4,
        name: "Tom Cook",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ], // Client Contact field
    assocReferenceNo: "REF-2022-001", // Associated Reference No. if exists
    fundingSource: "State Budget", // Funding Source
    notes:
      "Project will span multiple fiscal years, pending approval from stakeholders.", // Notes field
    noteLog: [
      {
        description: "Initial contact made",
        user: "Jane Smith",
        timestamp: "12.12.2022",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "13.12.2022",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "13.12.2022",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "13.12.2022",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "13.12.2022",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "13.12.2022",
      },
    ], // Note log array
    locationName: "Arizona Main Office", // Location Name
    address: "123 Main Street, Phoenix, AZ", // Address field
    // room1Num: "303",
    // room2Num: "202",
    rooms: [
      { id: "000001", num: "123" },
      { id: "000002", num: "124" },
      { id: "000003", num: "125" },
      { id: "000004", num: "126" },
    ], // Room numbers
    projectSponsor: "Arizona Department of Infrastructure", // Project Sponsor
    ministry: "Ministry of Infrastructure", // Ministry field
    division: "Infrastructure Development", // Division field
    branchUnit: "Western Operations", // Branch/Unit field
    requestedCompletionDate: "2023-12-31", // Requested Completion Date
    assignedToPM: "Michael Johnson", // Assigned to PM field
    confirmed: true, // Confirmed checkbox
    estimatedCost: [
      { cost: 5000, year: 2021 },
      { cost: 3000, year: 2022 },
      { cost: 600, year: 2023 },
      { cost: 44000, year: 2024 },
      { cost: 33300, year: 2025 },
    ], // Estimated cost
  };

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
        if (!prevState) return null;

        return {
          ...prevState,
          [name]: checked, // Update the boolean value for checkboxes
        };
      });
    } else if (name === "notes") {
      setProjectData((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          noteLog: [
            {
              description: value,
              user: "Cheryl Chao",
              timestamp: new Date().toLocaleDateString(),
            },
            ...prevState.noteLog,
          ],
        };
      });
    } else {
      // Handle other input types (text, textarea, select)
      setProjectData((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          [name]: value, // Update the value for other inputs
        };
      });
    }
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
        if (!prevState) return null;

        return {
          ...prevState,
          estimatedCost: [
            { cost: parsedCost, year: parsedYear }, // Use the number values
            ...prevState.estimatedCost,
          ],
        };
      });
      setCost({ cost: null, year: null }); // Reset cost and year
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      // const response = await fetch(`/api/projects/${projectId}`); // Adjust this to match your API endpoint
      // if (!response.ok) {
      //   throw new Error("Failed to fetch project data");
      // }
      // const data = await response.json();
      setProjectData(fakeData); // Set the project data in state
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProjectData
  ) => {
    setProjectData((prevState) => ({
      ...prevState!,
      [field]: formatDateForDisplay(e.target.value), // Update the date in 'DD.MM.YYYY' format
    }));
  };

  if (loading) {
    return (
      <div className="mt-4 flex justify-center items-center min-h-screen flex-col">
        <p className="mb-4 text-m">Loading project data...</p>
        <Hourglass height="80" width="80" ariaLabel="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-700">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Project Intake Update
        </h1>
      </div>
      <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Project ID */}
        <div className="sm:col-span-3">
          <label htmlFor="projectId" className={labelClassName}>
            Project ID
          </label>
          <div className="mt-2">
            <input
              id="projectId"
              name="projectId"
              type="text"
              value={projectData?.projectId || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Project Name */}
        <div className="sm:col-span-3">
          <label htmlFor="projectName" className={labelClassName}>
            Project Name
          </label>
          <div className="mt-2">
            <input
              id="projectName"
              name="projectName"
              type="text"
              value={projectData?.projectName || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Project Short Description */}
        <div className="sm:col-span-6">
          <label htmlFor="project-description" className={labelClassName}>
            Project Short Description
          </label>
          <div className="mt-2">
            <input
              id="project-description"
              name="project-description"
              type="text"
              value={projectData?.projectDescription || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Priority */}
        <div className="sm:col-span-3">
          <label htmlFor="priority" className={labelClassName}>
            Priority
          </label>
          <div className="mt-2">
            <select
              id="priority"
              name="priority"
              value={projectData?.priority || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* On Opp. List? */}
        <div className="mt-8 flex items-center sm:col-span-3">
          <label className={`${labelClassName} mr-2`}>On Opp. List ?</label>
          <input
            id="onOppList"
            name="onOppList"
            type="checkbox"
            checked={projectData?.onOppList || false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={handleInputChange}
          />
        </div>
        {/* Deadline */}
        <div className="sm:col-span-3">
          <label htmlFor="deadline" className={labelClassName}>
            Deadline
          </label>
          <div className="mt-2">
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={projectData?.deadline ?? ""}
              className={`${inputClassName} pr-2`}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* First Contact Date */}
        <div className="sm:col-span-3">
          <label htmlFor="first-contact-date" className={labelClassName}>
            First Contact Date
          </label>
          <div className="mt-2">
            <input
              id="first-contact-date"
              name="first-contact-date"
              type="date"
              value={projectData?.firstContactDate ?? ""}
              className={`${inputClassName} pr-2`}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Status */}
        <div className="sm:col-span-3">
          <label htmlFor="status" className={labelClassName}>
            Status
          </label>
          <div className="mt-2">
            <select
              id="status"
              name="status"
              value={projectData?.status || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* implemented */}
        <div className="mt-8 flex items-center sm:col-span-3">
          <label className={`${labelClassName} mr-2`}>
            In Implementation Phase ?
          </label>
          <input
            id="onOppList"
            name="onOppList"
            type="checkbox"
            checked={projectData?.onOppList || false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            onChange={handleInputChange}
          />
        </div>

        {/* Alias */}
        <div className="sm:col-span-3">
          <label htmlFor="alias" className={labelClassName}>
            Alias
          </label>
          <div className="mt-2">
            <input
              id="alias"
              name="alias"
              type="text"
              value={projectData?.alias || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="sm:col-span-3"></div>

        {/* Waiting On Contact(s) */}
        <div className="sm:col-span-3">
          <label htmlFor="waitingOnContact" className={labelClassName}>
            Waiting on Contact(s)
          </label>
          <div className="mt-2">
            <select
              id="waitingOnContact"
              name="waitingOnContact"
              value={projectData?.waitingOnContact || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {waitingOnContactOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Waiting For */}
        <div className="sm:col-span-3">
          <label htmlFor="waitingFor" className={labelClassName}>
            Waiting For
          </label>
          <div className="mt-2">
            <select
              id="waitingFor"
              name="waitingFor"
              value={projectData?.waitingFor || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {waitingForOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Assigned To */}
        <div className="sm:col-span-3">
          <DynamicSearchListbox
            label="Assigned To"
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
            fetchOptions={fetchUsersFromApi} // Pass the function to fetch options
          />
        </div>
        {/* Client Ministry */}
        <div className="sm:col-span-3">
          <label htmlFor="clientMinistry" className={labelClassName}>
            Client Ministry
          </label>
          <div className="mt-2">
            <select
              id="clientMinistry"
              name="clientMinistry"
              value={projectData?.clientMinistry || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {clientMinistryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Folder Name */}
        <div className="sm:col-span-3">
          <label htmlFor="folderName" className={labelClassName}>
            Folder Name (if exist)
          </label>
          <div className="mt-2">
            <input
              id="folderName"
              name="folderName"
              type="text"
              value={projectData?.folderName || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Intake From Status */}
        <div className="sm:col-span-3">
          <label htmlFor="intakeFormStatus" className={labelClassName}>
            Intake From Status
          </label>
          <div className="mt-2">
            <select
              id="intakeFormStatus"
              name="intakeFormStatus"
              value={projectData?.intakeFormStatus || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {intakeFormStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Last Communication (Out Bound) */}
        <div className="sm:col-span-3">
          <label htmlFor="lastComm" className={labelClassName}>
            Last Comm. (Outbound)
          </label>
          <div className="mt-2">
            <input
              id="lastComm"
              name="lastComm"
              type="date"
              value={projectData?.lastComm || ""}
              className={`${inputClassName} pr-2`}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Client Contacts */}
        <div className="sm:col-span-3">
          <DynamicSearchListbox
            label="Client Contacts"
            assignedTo={clientContacts} // Pass an array when allowMultiple is true
            setAssignedTo={setClientContacts} // Modify to accept the array
            fetchOptions={fetchUsersFromApi}
            allowMultiple={true} // Multiple selection enabled
          />
        </div>
        {/* Assoc Reference No. (if exist) */}
        <div className="sm:col-span-3">
          <label htmlFor="assocReferenceNo" className={labelClassName}>
            Assoc Reference No. (if exist)
          </label>
          <div className="mt-2">
            <input
              id="assocReferenceNo"
              name="assocReferenceNo"
              type="text"
              value={projectData?.assocReferenceNo || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Funding Source */}
        <div className="sm:col-span-3">
          <label htmlFor="fundingSource" className={labelClassName}>
            Funding Source
          </label>
          <div className="mt-2">
            <select
              id="fundingSource"
              name="fundingSource"
              value={projectData?.fundingSource || ""}
              className={inputClassName}
              onChange={handleInputChange}
            >
              {fundingSourceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
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
                {projectData?.noteLog.map((note, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {note.description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {note.user}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {note.timestamp}
                    </td>
                  </tr>
                ))}
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
          } // Pass the JSX as content
          confirmLabel="Save"
          confirmAction={() => {
            handleInputChange({
              target: { name: "notes", value: notes },
            } as any);
            setNotes("");
            setCreateNoteOpen(false); // Close modal after saving
          }}
          cancelLabel="Cancel"
          cancelAction={() => setNotes("")}
        />

        {/* Location Name */}
        <div className="sm:col-span-3">
          <label htmlFor="locationName" className={labelClassName}>
            Location Name
          </label>
          <div className="mt-2">
            <input
              id="locationName"
              name="locationName"
              type="text"
              value={projectData?.locationName || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Address */}
        <div className="sm:col-span-3">
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <div className="mt-2">
            <input
              id="address"
              name="address"
              type="text"
              value={projectData?.address || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="sm:col-span-6">
          <h3 className="">Rooms</h3>
          <p id="email-error" className="mt-2 text-sm text-red-600">
            * Please click on each room to view solution profile.
          </p>
          <div className="flex space-x-4 mt-3">
            {projectData?.rooms.map((room) => (
              <a
                key={room.id}
                href={`/room/${room.id}`}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <BuildingLibraryIcon className="h-5 w-5 mr-1.5" />
                Room {room.num}
              </a>
            ))}
            <a
              href="#"
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              + Add Room
            </a>
          </div>
        </div>

        {/* Project Sponsor */}
        <div className="sm:col-span-3">
          <label htmlFor="projectSponsor" className={labelClassName}>
            Project Sponsor
          </label>
          <div className="mt-2">
            <input
              id="projectSponsor"
              name="projectSponsor"
              type="text"
              value={projectData?.projectSponsor || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Ministry */}
        <div className="sm:col-span-3">
          <label htmlFor="ministry" className={labelClassName}>
            Ministry
          </label>
          <div className="mt-2">
            <input
              id="ministry"
              name="ministry"
              type="text"
              value={projectData?.ministry || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Division */}
        <div className="sm:col-span-3">
          <label htmlFor="division" className={labelClassName}>
            Division
          </label>
          <div className="mt-2">
            <input
              id="division"
              name="division"
              type="text"
              value={projectData?.division || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Branch/Unit */}
        <div className="sm:col-span-3">
          <label htmlFor="branchUnit" className={labelClassName}>
            Branch/Unit
          </label>
          <div className="mt-2">
            <input
              id="branchUnit"
              name="branchUnit"
              type="text"
              value={projectData?.branchUnit || ""}
              className={inputClassName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Requested Completion Date */}
        <div className="sm:col-span-3">
          <label htmlFor="requestedCompletionDate" className={labelClassName}>
            Requested Completion Date
          </label>
          <div className="mt-2">
            <input
              id="requestedCompletionDate"
              name="requestedCompletionDate"
              type="date"
              value={projectData?.requestedCompletionDate || ""}
              className={`${inputClassName} pr-2`}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Assigned to PM */}
        <div className="sm:col-span-3"></div>

        {/* Estimated Cost */}
        <div className="sm:col-span-6">
          <h3 className="">Estimated Cost/Fiscal</h3>
          <div className="mt-2 overflow-y-auto max-h-36 outline outline-gray-100 rounded-sm">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Year
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectData?.estimatedCost.map((data, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {data.year}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      ${data.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right text-sky-500 hover:text-sky-700">
            <a href="#" onClick={() => setCreateCostOpen(true)}>
              + Add Estimated Cost/Fiscal
            </a>
          </div>
        </div>
        {/* Create New Cost Modal */}
        <Modal
          open={createCostOpen}
          onClose={() => {
            if (!error) {
              setCreateCostOpen(false); // Only close the modal if there's no error
            } else {
              setCostInputError(null);
            }
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
          confirmAction={handleSaveCost} // Save the cost and year
          cancelLabel="Cancel"
          cancelAction={() => {
            setCostInputError(null);
            setCost({ cost: null, year: null });
          }} // Clear the error message and reset the cost and year
        />
      </form>

      <div className="flex mt-10">
        <div className="">
          <button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Milestones
          </button>
        </div>
        <div className="">
          <button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Requisition Orders
          </button>
        </div>
      </div>
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

export default UpdateProjectPage;
