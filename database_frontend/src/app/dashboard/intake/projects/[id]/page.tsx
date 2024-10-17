"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Hourglass } from "react-loader-spinner";
import {
  XCircleIcon,
  BuildingLibraryIcon,
  CheckIcon,
  XMarkIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import DynamicSearchListbox from "@/components/DynamicSearchListbox";
import Modal from "@/components/Modal";
import { Person } from "@/types/intakes/person";
import { Project } from "@/types/intakes/project";
import { Milestone, MilestoneKey } from "@/types/intakes/milestone";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormDate from "@/components/FormDate";
import FormCheckbox from "@/components/FormCheckbox";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import {
  priorityOptions,
  statusOptions,
  waitingOnContactOptions,
  waitingForOptions,
  intakeFormStatusOptions,
  clientMinistryOptions,
  fundingSourceOptions,
  milestoneStatus,
} from "constants/intake/dropDownOptions";

// Convert to 'YYYY-MM-DD' format
const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

const fetchUsersFromApi = async (query: string) => {
  const response = await fetch(`${apiUrl}/users?name=${query}`);
  return await response.json(); // Returns the people data
};

const getIcon = (status: string) => {
  switch (status) {
    case "Planned":
      return (
        <DocumentCheckIcon className="h-5 w-5 text-blue-500 inline-block mr-2" />
      );
    case "Completed":
      return <CheckIcon className="h-5 w-5 text-green-500 inline-block mr-2" />;
    case "Not Required":
      return <XMarkIcon className="h-5 w-5 text-gray-400 inline-block mr-2" />;
    default:
      return null;
  }
};

const fakeMilestones: Record<MilestoneKey, Milestone> = {
  "Floor Plans": {
    forecastedDate: "2024-06-11",
    completedDate: "2024-05-11",
    status: "Completed",
  },
  "Site Visit (If required)": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "CRM Conceptual/Rearward": {
    forecastedDate: null,
    completedDate: null,
    status: "Not Required",
  },
  "Cabinet Design": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Client Design Document Walkthrough": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Floor Plan Markup and JVN LAN Marking": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Facilities Scope of Work Submitted to IO": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Functional Design Document Created": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Pictures/Initial Info Request": {
    forecastedDate: null,
    completedDate: null,
    status: "Not Required",
  },
  "Pictures Received": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Design Brief Meeting with Client": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Conceptual Created by ET": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "FSOW Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Equipment by Position Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "FSOW Sent MAS/FMB": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "PSIF Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "FDD Completed by JVN": {
    forecastedDate: null,
    completedDate: null,
    status: "Not Required",
  },
  "FDD Client Approved": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "ET Proposal Received": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Requisition Orders Created": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "VHH Sign-Off RO": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "CSO Sign-Off RO": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Package Sent to Bell": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Equipment Orders": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Equipment Staging & Programming": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Equipment Deliveries": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "Network Circuit Install or Uplift": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
  "AV Install": {
    forecastedDate: null,
    completedDate: null,
    status: "Planned",
  },
};

const UpdateProjectPage = () => {
  const pathname = usePathname();
  const id = pathname.split("/").pop(); // Extract project ID from route (e.g., MAG-001)
  const [projectData, setProjectData] = useState<Project | null>(null);
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

  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [milestones, setMilestones] = useState(fakeMilestones);

  // const fetchMilestoneData = async (projectId: string) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/milestones/${milestoneKey}`);
  //     return await response.json();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
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

  const fakeData: Project = {
    projectId: id || "MAG-001", // Use the project ID from the URL
    projectName: "Super Fun Project", // Project Name
    projectDescription:
      "Project related to infrastructure improvements in Arizona.",
    priority: "Low",
    onOppList: true, // This is for the "On Opp List?" checkbox
    implemented: false, // This is for the "In Implementation Phase?" checkbox
    deadline: "2024-12-03T10:30:00Z", // As seen in your screenshot
    firstContactDate: "2024-10-03T10:30:00Z", // First Contact Date
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
    lastComm: "2024-11-03T10:30:00Z", // Last Communication (Out Bound)
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
    noteLog: [
      {
        description: "Initial contact made",
        user: "Jane Smith",
        timestamp: "2024-12-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "2024-11-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "2024-10-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "2024-09-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "2024-08-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "John Doe",
        timestamp: "2024-07-03T10:30:00Z",
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
      if (!value) return; // Prevent empty notes from being added
      setProjectData((prevState) => {
        if (!prevState) return null;

        return {
          ...prevState,
          noteLog: [
            {
              description: value,
              user: "Cheryl Chao",
              timestamp: new Date().toISOString(),
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
            { cost: parsedCost, year: parsedYear },
            ...(prevState.estimatedCost || []),
          ],
        };
      });
      setCost({ cost: null, year: null }); // Reset cost and year
    }
  };

  const handleMilestoneDateChange = (
    key: MilestoneKey,
    field: "forecastedDate" | "completedDate",
    value: string
  ) => {
    setMilestones((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleMilestoneStatusChange = (key: MilestoneKey, value: string) => {
    setMilestones((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: value,
      },
    }));
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      console.log(projectId);
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
          <DynamicSearchListbox
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
          <DynamicSearchListbox
            label="Client Contacts"
            assignedTo={clientContacts}
            setAssignedTo={setClientContacts}
            fetchOptions={fetchUsersFromApi}
            allowMultiple={true}
          />
        </div>

        {/* Assoc Reference No. (if exist) */}
        <div className="sm:col-span-3">
          <FormInput
            id="assocReferenceNo"
            label="Assoc Reference No. (if exist)"
            name="assocReferenceNo"
            type="text"
            value={projectData?.assocReferenceNo || ""}
            onChange={handleInputChange}
            placeholder="Enter reference number"
          />
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
                {projectData?.noteLog.map((note, index) => (
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
          <FormInput
            id="locationName"
            label="Location Name"
            name="locationName"
            type="text"
            value={projectData?.locationName || ""}
            onChange={handleInputChange}
            placeholder="Enter location name"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-3">
          <FormInput
            id="address"
            label="Address"
            name="address"
            type="text"
            value={projectData?.address || ""}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </div>

        {/* Rooms */}
        <div className="sm:col-span-6">
          <h3 className="">Rooms</h3>
          <p id="email-error" className="mt-2 text-sm text-red-600">
            * Please click on each room to view solution profile.
          </p>
          <div className="flex space-x-4 mt-3">
            {projectData?.rooms?.length &&
              projectData.rooms.map((room) => (
                <a
                  key={room.id}
                  href={`/dashboard/intake/rooms/${room.id}`}
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

        {/* Ministry */}
        <div className="sm:col-span-3">
          <FormInput
            id="ministry"
            label="Ministry"
            name="ministry"
            type="text"
            value={projectData?.ministry || ""}
            onChange={handleInputChange}
            placeholder="Enter ministry"
          />
        </div>

        {/* Division */}
        <div className="sm:col-span-3">
          <FormInput
            id="division"
            label="Division"
            name="division"
            type="text"
            value={projectData?.division || ""}
            onChange={handleInputChange}
            placeholder="Enter division"
          />
        </div>

        {/* Branch/Unit */}
        <div className="sm:col-span-3">
          <FormInput
            id="branchUnit"
            label="Branch/Unit"
            name="branchUnit"
            type="text"
            value={projectData?.branchUnit || ""}
            onChange={handleInputChange}
            placeholder="Enter branch/unit"
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
            {projectData?.estimatedCost &&
            projectData.estimatedCost.length > 0 ? (
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
                  {projectData.estimatedCost.map((data, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                        {data.year}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                        ${data.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">
                There is no Cost/Fiscal record.
              </p>
            )}
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
          confirmAction={handleSaveCost}
          cancelLabel="Cancel"
          cancelAction={() => {
            setCostInputError(null);
            setCost({ cost: null, year: null });
          }}
        />
      </form>

      <div className="flex mt-10">
        <div className="">
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
            confirmAction={() => {
              // Save the milestone data
              setMilestoneOpen(false);
            }}
            content={
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Milestone
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Forecasted Date
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Completed Date
                      </th>
                      <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {Object.keys(milestones).map((key) => {
                      const milestoneKey = key as MilestoneKey;
                      const milestone = milestones[milestoneKey];
                      const isDisabled = milestone.status === "Not Required";
                      return (
                        <tr
                          key={milestoneKey}
                          className={isDisabled ? "bg-gray-100" : ""}
                        >
                          <td className="px-3 py-4 text-sm text-gray-900">
                            {milestoneKey}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            {!isDisabled && (
                              <input
                                type="date"
                                value={milestone.forecastedDate || ""}
                                onChange={(e) =>
                                  handleMilestoneDateChange(
                                    milestoneKey,
                                    "forecastedDate",
                                    e.target.value
                                  )
                                }
                                className="border rounded-md p-1"
                              />
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            {!isDisabled && (
                              <input
                                type="date"
                                value={milestone.completedDate || ""}
                                onChange={(e) =>
                                  handleMilestoneDateChange(
                                    milestoneKey,
                                    "forecastedDate",
                                    e.target.value
                                  )
                                }
                                className="border rounded-md p-1"
                              />
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div className="flex items-center">
                              {getIcon(milestones[milestoneKey].status)}
                              <select
                                value={milestones[milestoneKey].status}
                                onChange={(e) =>
                                  handleMilestoneStatusChange(
                                    milestoneKey,
                                    e.target.value
                                  )
                                }
                                className="border rounded-md p-1"
                              >
                                {milestoneStatus.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
          />
        </div>
        <div className="">
          <a
            href="/dashboard/intake/requisitionOrders"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Requisition Orders
          </a>
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
          <a
            href="/dashboard/intake/projects"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </a>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectPage;
