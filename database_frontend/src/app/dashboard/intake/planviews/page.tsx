"use client";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import Planview from "@/types/intakes/planview";
import Note from "@/types/intakes/note";
import {
  planviewStatus,
  planviewPhase,
} from "@/constants/intake/dropDownOptions";
import * as XLSX from "xlsx";

const labelClassName = "block text-sm font-medium leading-6 text-gray-900";
const tableColumns = [
  { label: "Project ID", key: "projectId" },
  { label: "Customer", key: "customer" },
  { label: "Work Type", key: "workType" },
  {
    label: "Added to Planview through PMO? (If so, date)",
    key: "addedToPlanview",
  },
  { label: "Overall Phase", key: "overallPhase" },
  { label: "Overall status", key: "overallStatus" },
  { label: "Work Description", key: "workDescription" },
  { label: "Requested Start", key: "requestedStart" },
  { label: "Requested Finish", key: "requestedFinish" },
  { label: "Notes", key: "notes" },
  { label: "Planview ID", key: "planviewId" },
  { label: "Click to delete", key: "delete" },
];

// Sortable columns
const sortableColumns = [
  "addedToPlanview",
  "requestedStart",
  "requestedFinish",
];

const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};
const planviewData: Planview[] = [
  {
    projectId: "MAG-402",
    customer: "Court Modernization",
    workType: "Project",
    addedToPlanview: "July 4, 2023",
    overallPhase: "Close Out",
    overallStatus: "On Track",
    workDescription: "A/V + VC Install",
    requestedStart: "Sep 22, 2023",
    requestedFinish: "Sep 28, 2023",
    planviewId: "402",
  },
  {
    projectId: "MAG-449",
    customer: "Court Modernization",
    workType: "Project",
    addedToPlanview: "July 4, 2023",
    overallPhase: "Close Out",
    overallStatus: "On Track",
    workDescription: "Courthouse Video Solution",
    requestedStart: "Sep 22, 2023",
    requestedFinish: "Sep 28, 2023",
    planviewId: "449",
  },
  {
    projectId: "MAG-456-4",
    customer: "Court Modernization",
    workType: "Project",
    addedToPlanview: "July 4, 2023",
    overallPhase: "Close Out",
    overallStatus: "On Track",
    workDescription: "Courtrooms 11, 12, 13, 14 & RTR",
    requestedStart: "Sep 22, 2023",
    requestedFinish: "Sep 28, 2023",
    planviewId: "456-4",
  },
  {
    projectId: "MAG-500",
    customer: "IT Department",
    workType: "Project",
    addedToPlanview: "August 1, 2023",
    overallPhase: "Implementation",
    overallStatus: "At Risk",
    workDescription: "Network upgrade",
    requestedStart: "Oct 1, 2023",
    requestedFinish: "Oct 10, 2023",
    planviewId: "500",
  },
  {
    projectId: "MAG-501",
    customer: "HR Department",
    workType: "Project",
    addedToPlanview: "",
    overallPhase: "Planning",
    overallStatus: "Manageable",
    workDescription: "New employee portal",
    requestedStart: "Oct 5, 2023",
    requestedFinish: "Oct 20, 2023",
    planviewId: "501",
  },
];

const notesData: Note[] = [
  {
    id: "1",
    description: "Initial contact made",
    user: "Jane Smith",
    timestamp: "2024-12-03T10:30:00Z",
  },
  {
    id: "2",
    description: "Follow-up email sent",
    user: "John Doe",
    timestamp: "2024-11-03T10:30:00Z",
  },
  {
    id: "3",
    description: "Follow-up email sent",
    user: "John Doe",
    timestamp: "2024-10-03T10:30:00Z",
  },
  {
    id: "4",
    description: "Follow-up email sent",
    user: "John Doe",
    timestamp: "2024-09-03T10:30:00Z",
  },
];

const PlanviewListPage = () => {
  // hello world
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);

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
  const sortedPlanviews = [...planviewData].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];

      if (aValue === undefined || bValue === undefined) return 0;
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

    // Your data fetch logic here based on filters
    console.log({ projectId, startDate, endDate, status });
  };

  const handleReset = () => {
    // Reset all state to empty or default values
    setProjectId("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setPhase("");

    // // Refetch original data
    // fetchData();
  };

  const exportToExcel = () => {
    console.log("Exporting to Excel");
    // Create a new worksheet from the planviewData
    const worksheet = XLSX.utils.json_to_sheet(planviewData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planview Data");

    // Generate a download link for the workbook
    XLSX.writeFile(workbook, "planview_data.xlsx");
    console.log("Exported to Excel");
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">Planviews</h1>
      </div>
      <div className="mt-4">
        {/* Filter Section */}
        <div className="bg-white p-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
            {/* Phase Filter */}
            <div>
              <label htmlFor="phase" className={labelClassName}>
                Phase
              </label>
              <select
                id="phase"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Phase</option>
                {planviewPhase.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
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
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Status</option>
                {planviewStatus.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="pt-8 flex justify-center">
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
          </div>
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
                          sortableColumns.includes(column.key)
                            ? "hover:bg-gray-200 hover:text-indigo-600 cursor-pointer"
                            : ""
                        }`}
                        onClick={() =>
                          sortableColumns.includes(column.key)
                            ? handleSort(column.key)
                            : null
                        }
                      >
                        {column.label}
                        {/* Show arrow for sortable columns */}
                        {sortableColumns.includes(column.key) && (
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
                  {sortedPlanviews.map((planview, index) => (
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
                          {column.key === "notes" ? (
                            <a
                              onClick={() => setNotesOpen(true)}
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                            >
                              notes
                            </a>
                          ) : column.key === "delete" ? (
                            <a
                              href="#"
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              delete
                            </a>
                          ) : (
                            planview[column.key as keyof typeof planview]
                          )}
                        </td>
                      ))}
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
      {/* Modal for Notes */}
      <Modal
        open={notesOpen}
        onClose={setNotesOpen}
        title="Note Logs"
        confirmLabel="Close"
        confirmAction={() => setNotesOpen(false)}
        displayCancelLabel={false}
        content={
          <div className="mt-2 overflow-y-auto outline outline-gray-100 rounded-sm">
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
              <tbody className="bg-white divide-y divide-gray-200 text-left">
                {notesData.map((note, index) => (
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
        }
      />
      <div className="flex mt-10 justify-end">
        <div className="">
          <a
            href="/dashboard/intake/projects"
            className="cursor-pointer mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back
          </a>
        </div>
        <div className="">
          <a
            onClick={exportToExcel}
            className="cursor-pointer mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export to Excel
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlanviewListPage;
