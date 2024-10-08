"use client";
import { useState } from "react";
import DynamicSearchListbox from "@/components/DynamicSearchListbox";
import { Person } from "@/types/intakes/person";
import { Project } from "@/types/intakes/project";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormDate from "@/components/FormDate";
import FormCheckbox from "@/components/FormCheckbox";
import Link from "next/link";
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

const initialProjectData: Project = {
  projectId: "",
  projectName: "",
  projectDescription: "",
  priority: "",
  onOppList: false,
  deadline: "",
  firstContactDate: "",
  status: "",
  implemented: false,
  waitingOnContact: "",
  waitingFor: "",
  assignedTo: {
    id: 0,
    name: "",
    avatar: "",
  },
  clientMinistry: "",
  folderName: "",
  intakeFormStatus: "",
  lastComm: "",
  clientContacts: [],
  assocReferenceNo: "",
  fundingSource: "",
  noteLog: [],
};

const fetchUsersFromApi = async (query: string) => {
  const response = await fetch(`${apiUrl}/users?name=${query}`);
  return await response.json(); // Returns the people data
};

const CreateProjectPage = () => {
  const [projectData, setProjectData] = useState<Project>(initialProjectData);
  const [assignedTo, setAssignedTo] = useState<Person[]>([]);
  const [clientContacts, setClientContacts] = useState<Person[]>(
    projectData?.clientContacts ?? []
  );

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
              user: "Cheryl Chao",
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
    } else {
      // Handle other input types (text, textarea, select)
      setProjectData((prevState) => {
        return {
          ...prevState,
          [name]: value, // Update the value for other inputs
        };
      });
    }
  };
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Create a New Project
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
            onChange={handleInputChange}
            placeholder="Enter project short description"
          />
        </div>
        {/* Priority */}
        <div className="sm:col-span-3">
          <FormSelect
            id="priority"
            name="priority"
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

        {/* Notes */}
        {/*textarea*/}
        <div className="sm:col-span-6">
          <label
            htmlFor="notes"
            className="block font-medium leading-6 text-gray-900"
          >
            Notes
          </label>
          <div className="mt-2">
            <textarea
              id="notes"
              name="notes"
              value={projectData?.noteLog[0]?.description || ""}
              onChange={handleInputChange}
              placeholder="Enter your notes here..."
              rows={4}
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <hr className="my-6 border-t border-gray-300" />
          <div className="flex mt-10 justify-end">
            <div className="">
              <Link href="/dashboard/intake/projects">
                <button className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                  Cancel
                </button>
              </Link>
            </div>
            <div className="">
              <button className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPage;
