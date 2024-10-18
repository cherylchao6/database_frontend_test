"use client";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { XCircleIcon } from "@heroicons/react/24/outline";

// Status options array
const statusOptions = [
  { value: "", label: "All" },
  { value: "In Intake", label: "In Intake" },
  { value: "Follow-up", label: "Follow-up" },
  // Add more options as needed
];

interface Project {
  projectId: string;
  projectName: string;
  waitingOn: string;
  waitingFor: string;
  status: string;
  priority: string;
  intakesFromStatus: string;
  onOpsList: boolean; // Ensure this is boolean
  lastComm: string;
  projectSponsor: string;
  dateAdded: string;
  implemented: boolean; // Ensure this is boolean
}

// Dummy data for projects (declared globally)
const projectData: Project[] = [
  {
    projectId: "MAG-001",
    projectName: "STGC",
    waitingOn: "JVN exec.",
    waitingFor: "Follow-up",
    status: "GSO - In Intake",
    priority: "Moderate",
    intakesFromStatus: "OBB/Follow-up reg/ESC",
    onOpsList: true,
    lastComm: "11-Sep-22",
    projectSponsor: "MAG",
    dateAdded: "13-Sep-22",
    implemented: true,
  },
  {
    projectId: "MAG-002",
    projectName: "STGC",
    waitingOn: "JVN exec.",
    waitingFor: "Follow-up",
    status: "GSO - In Intake",
    priority: "Moderate",
    intakesFromStatus: "OBB/Follow-up reg/ESC",
    onOpsList: true,
    lastComm: "12-Sep-22",
    projectSponsor: "MAG",
    dateAdded: "12-Sep-22",
    implemented: true,
  },
  {
    projectId: "MAG-003",
    projectName: "STGC",
    waitingOn: "JVN exec.",
    waitingFor: "Follow-up",
    status: "GSO - In Intake",
    priority: "Moderate",
    intakesFromStatus: "OBB/Follow-up reg/ESC",
    onOpsList: false,
    lastComm: "13-Sep-22",
    projectSponsor: "MAG",
    dateAdded: "11-Sep-22",
    implemented: true,
  },
  // Add more dummy data objects here...
];

// Column headers
const tableColumns = [
  { label: "Project ID", key: "projectId" },
  { label: "Project Name", key: "projectName" },
  { label: "Waiting On", key: "waitingOn" },
  { label: "Waiting For", key: "waitingFor" },
  { label: "Status", key: "status" },
  { label: "Priority", key: "priority" },
  { label: "Intakes From Status", key: "intakesFromStatus" },
  { label: "On Ops List", key: "onOpsList" },
  { label: "Last Comm.", key: "lastComm" },
  { label: "Project Sponsor", key: "projectSponsor" },
  { label: "Date Added", key: "dateAdded" },
  { label: "In Implementation", key: "implemented" },
];

const ProjectListPage = () => {
  const labelClassName = "block text-sm font-medium leading-6 text-gray-900";
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(""); // State to store error message

  const totalItems = 50;
  const itemsPerPage = 20;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // You can make an API call here to fetch new page data if needed
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // If the same column is clicked, toggle the sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Sort by the new column in ascending order
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Sort the project data based on the current sort state
  const sortedProjects = [...projectData].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSearch = () => {
    // if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    //   setError("End Date cannot be earlier than Start Date");
    //   return;
    // }

    setError(""); // Clear error if validation passes

    // Your data fetch logic here based on filters
    console.log({ projectId, startDate, endDate, status });
  };

  const handleReset = () => {
    // Reset all state to empty or default values
    setProjectId("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setError("");

    // // Refetch original data
    // fetchData();
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Active Projects
        </h1>
      </div>
      <div className="mt-4">
        {/* Filter Section */}
        <div className="bg-white p-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Project ID Filter */}
            <div>
              <label htmlFor="projectId" className={labelClassName}>
                Project ID
              </label>
              <input
                type="text"
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter Project ID"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 p-3 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <label htmlFor="startDate" className={labelClassName}>
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) {
                    // Optional: reset endDate if it's before startDate
                    setEndDate("");
                  }
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Date Range End */}
            <div>
              <label htmlFor="endDate" className={labelClassName}>
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 text-right">
            <button
              onClick={handleSearch}
              className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-red-400"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-700">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <a href="/dashboard/intake/projects/create">
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Create New Project
            </button>
          </a>
        </div>
        {/* Table Section */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {tableColumns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 bg-gray-100 ${
                          column.key === "lastComm" ||
                          column.key === "dateAdded"
                            ? "hover:bg-gray-200 hover:text-indigo-600 cursor-pointer"
                            : ""
                        }`}
                        onClick={() =>
                          column.key === "lastComm" ||
                          column.key === "dateAdded"
                            ? handleSort(column.key)
                            : null
                        }
                      >
                        {column.label}
                        {/* Show arrow for sortable columns */}
                        {(column.key === "lastComm" ||
                          column.key === "dateAdded") && (
                          <span className="ml-2">
                            {sortColumn === column.key
                              ? sortDirection === "asc"
                                ? "↓"
                                : "↑"
                              : "↓"}
                          </span>
                        )}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3 bg-gray-100"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortedProjects.map((project, index) => (
                    <tr key={index}>
                      {tableColumns.map((column) => (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-3 ${
                            column.key === "projectId"
                              ? "font-bold text-gray-900"
                              : "text-gray-900"
                          }`}
                        >
                          {column.key === "onOpsList" ||
                          column.key === "implemented" ? (
                            <input
                              type="checkbox"
                              checked={
                                project[column.key as keyof Project] as boolean
                              }
                              readOnly
                              className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                          ) : (
                            project[column.key as keyof typeof project]
                          )}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <a
                          href={`/dashboard/intake/projects/${project.projectId}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <span className="sr-only">, {project.projectId}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
      {/* Buttons */}
      <div className="mt-4 text-right">
        <a
          // onClick={}
          href="/dashboard/intake/planviews"
          className="cursor-pointer mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Planview
        </a>
        <button
          // onClick={}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Bell Opp.List
        </button>
      </div>
    </div>
  );
};

export default ProjectListPage;
