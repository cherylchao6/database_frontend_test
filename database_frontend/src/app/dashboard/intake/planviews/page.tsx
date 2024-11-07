"use client";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import Planview from "@/types/intakes/planview";
import { planviewPhases, planviewStatuses } from "@/types/intakes/planview";
import { ministries } from "@/types/organization";
import Note from "@/types/intakes/note";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import {
  ArchiveBoxXMarkIcon,
  PencilIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const labelClassName = "block text-sm font-medium leading-6 text-gray-900";
const tableColumns = [
  { label: "Ministry", key: "projectMinistry" },
  { label: "Project ID", key: "projectId" },
  { label: "Project Name", key: "projectName" },
  { label: "Project Description", key: "projectDescription" },
  { label: "Project Phase", key: "phase" },
  { label: "Project status", key: "status" },
  { label: "Requested Start", key: "requestedStartDate" },
  { label: "Requested Finish", key: "requestedFinishDate" },
  { label: "Notes", key: "projectNotes" },
];

// Sortable columns
const sortableColumns = ["requestedStartDate", "requestedFinishDate"];

// Convert to format YYYY-MM-DD
const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

const notesData: Note[] = [
  {
    id: "1",
    description: "Initial contact made, but still need more follow-up",
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

const planviewData: Planview[] = [
  {
    planviewId: "1",
    projectId: "MAG-402",
    projectMinistry: "MAG",
    projectName: "Phase ll- Bulk Order",
    projectDescription: "A/V + VC Install",
    phase: "Planning",
    status: "On Track",
    requestedStartDate: "2024-09-03T10:30:00Z",
    requestedFinishDate: "2024-10-03T10:30:00Z",
    projectNotes: notesData,
  },
  {
    planviewId: "2",
    projectId: "MAG-449",
    projectMinistry: "MAG",
    projectName: "Phase ll- Network",
    projectDescription: "Courthouse Video Solution",
    phase: "Planning",
    status: "On Hold",
    requestedStartDate: "2024-08-03T10:30:00Z",
    requestedFinishDate: "2024-12-03T10:30:00Z",
    projectNotes: notesData,
  },
];

const PlanviewListPage = () => {
  // get user from session
  const user = useSession().data?.user?.name;
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [ministry, setMinistry] = useState("");
  const [phase, setPhase] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [projectNotes, setProjectNotes] = useState<Note[]>(notesData);
  const [createNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteNoteModalOpen, setDeleteNoteModalOpen] = useState(false);
  const [selectedPlanview, setSelectedPlanview] = useState<Planview | null>(
    null
  );
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [formData, setFormData] = useState({
    phase: "",
    status: "",
    requestedStartDate: "",
    requestedFinishDate: "",
  });

  const [error, setError] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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

  const [planviews, setPlanviews] = useState(sortedPlanviews);

  // Handle checkbox change for each row
  const handleCheckboxChange = (projectId: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(projectId)
        ? prevSelected.filter((id) => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  const handleEditClick = (planview: Planview) => {
    setSelectedPlanview(planview);
    setFormData({
      phase: planview.phase,
      status: planview.status,
      requestedStartDate: planview.requestedStartDate.split("T")[0],
      requestedFinishDate: planview.requestedFinishDate.split("T")[0],
    });
    setEditModalOpen(true);
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "requestedStartDate" && formData.requestedFinishDate) {
      if (value > formData.requestedFinishDate) {
        setError("Finish date cannot be earlier than start date");
      } else {
        setError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // if (formData.requestedStartDate > formData.requestedStartDate) {
    //   console.log("Error");
    //   setError("Finish date cannot be earlier than start date");
    // } else {
    //   setError("");
    // }
  };

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
    setMinistry("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setPhase("");

    // // Refetch original data
    // fetchData();
  };

  const handleArchiveClick = (planview: Planview) => {
    setSelectedPlanview(planview);
    setArchiveModalOpen(true);
  };

  const exportToExcel = () => {
    const selectedPlanviews = planviews.filter((planview) =>
      selectedRows.includes(planview.projectId)
    );

    const worksheet = XLSX.utils.json_to_sheet(selectedPlanviews);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Planview Data");

    // Generate a download link for the workbook
    XLSX.writeFile(workbook, "planview_data.xlsx");
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
            {/* Ministry Filter */}
            <div>
              <label htmlFor="projectId" className={labelClassName}>
                Ministry
              </label>
              <select
                id="ministry"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Ministry</option>
                {ministries.map((ministry) => (
                  <option key={ministry} value={ministry}>
                    {ministry}
                  </option>
                ))}
              </select>
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
                {planviewPhases.map((phase) => (
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
                {planviewStatuses.map((status) => (
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
          </div>
          <div className="pt-8 flex justify-end">
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

        {/* Table Section */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 bg-gray-100">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelectedRows(
                            e.target.checked
                              ? planviews.map((planview) => planview.projectId)
                              : []
                          )
                        }
                        checked={selectedRows.length === planviews.length}
                      />
                    </th>
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
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3 bg-gray-100"
                    >
                      <span className="sr-only">Archive</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {planviews.map((planview, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(planview.projectId)}
                          onChange={() =>
                            handleCheckboxChange(planview.projectId)
                          }
                        />
                      </td>
                      {tableColumns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900"
                        >
                          {column.key === "projectNotes" ? (
                            <a
                              href="#"
                              onClick={() => setNotesOpen(true)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {planview.projectNotes[0]?.description.length > 20
                                ? `${planview.projectNotes[0].description.slice(
                                    0,
                                    20
                                  )}...`
                                : planview.projectNotes[0]?.description ||
                                  "No Notes"}
                            </a>
                          ) : column.key === "projectId" ? (
                            <a
                              href={`/dashboard/intake/projects/${planview.projectId}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {planview.projectId}
                            </a>
                          ) : column.key === "requestedStartDate" ||
                            column.key === "requestedFinishDate" ? (
                            typeof planview[column.key as keyof Planview] ===
                            "string" ? (
                              formatTimestamp(
                                planview[column.key as keyof Planview] as string
                              )
                            ) : (
                              ""
                            )
                          ) : (
                            String(planview[column.key as keyof Planview] ?? "")
                          )}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditClick(planview)}
                        >
                          Edit
                        </a>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleArchiveClick(planview)}
                          className="text-gray-500 hover:text-red-600"
                          title="Archive"
                        >
                          <ArchiveBoxXMarkIcon className="h-5 w-5" />
                        </button>
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
      {/* Modal for Notes */}
      <Modal
        open={notesOpen}
        onClose={setNotesOpen}
        title="Note Logs"
        confirmLabel="Create Note"
        confirmAction={() => setCreateNoteModalOpen(true)}
        displayCancelLabel={true}
        cancelLabel="Close"
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
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-left">
                {projectNotes.map((note, index) => (
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {note.user === user ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setNotes(note.description);
                              setSelectedNote(note);
                              setCreateNoteModalOpen(true);
                            }}
                            className="text-yellow-500 hover:text-yellow-600"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNote(note);
                              setDeleteNoteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-600"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      />

      {/* Modal for Create Note */}
      <Modal
        open={createNoteModalOpen}
        onClose={() => {}}
        title="Create Note"
        content={
          <form className="space-y-4 text-left">
            <div>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                className="mt-2 block w-full p-2 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write something..."
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        }
        confirmLabel="Save"
        confirmAction={() => {
          setCreateNoteModalOpen(false);
          if (!notes) return;

          // Update the selected note if it exists
          if (selectedNote) {
            setProjectNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === selectedNote.id
                  ? {
                      ...note,
                      description: notes,
                      timestamp: new Date().toISOString(),
                    }
                  : note
              )
            );
          } else {
            setProjectNotes([
              {
                id: String(projectNotes.length + 1),
                description: notes,
                user: user ? user : "Jane Chen",
                timestamp: new Date().toISOString(),
              },
              ...projectNotes,
            ]);
          }

          setNotes("");
        }}
        cancelLabel="Cancel"
        cancelAction={() => {
          setCreateNoteModalOpen(false);
        }}
      />

      {/* Modal for Edit Planview */}
      {selectedPlanview && (
        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Planview"
          content={
            <form className="space-y-4 text-left">
              {/* Display read-only fields */}
              {/* Message and link for full edit */}
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-1" />
                <p className="text-sm text-gray-700 font-semibold">
                  To edit project data, please click{" "}
                  <a
                    href={`/dashboard/intake/projects/${selectedPlanview.projectId}`}
                    className="text-indigo-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Here
                  </a>
                  .
                </p>
              </div>

              <div className="">
                <label
                  className="block text-sm font-semibold
 text-gray-700"
                >
                  Project ID
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPlanview.projectId}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold
 text-gray-700"
                >
                  Ministry
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPlanview.projectMinistry}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold
 text-gray-700"
                >
                  Project Name
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPlanview.projectName}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold
 text-gray-700"
                >
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedPlanview.projectDescription}
                </p>
              </div>

              {/* Editable fields */}
              <div>
                <label className={labelClassName}>Phase</label>
                <select
                  name="phase"
                  value={formData.phase}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  {planviewPhases.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  {planviewStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Requested Start Date</label>
                <input
                  type="date"
                  name="requestedStartDate"
                  value={formData.requestedStartDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className={labelClassName}>Requested Finish Date</label>
                <input
                  type="date"
                  name="requestedFinishDate"
                  value={formData.requestedFinishDate}
                  min={formData.requestedStartDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>
            </form>
          }
          confirmLabel="Save"
          confirmAction={() => {
            // Implement save functionality here
            setEditModalOpen(false);
          }}
          cancelLabel="Cancel"
          cancelAction={() => setEditModalOpen(false)}
        />
      )}
      {/* Modal for confirm archive planview */}
      <Modal
        open={archiveModalOpen}
        onClose={() => {}}
        title={`Archive Planview of Project: ${selectedPlanview?.projectId}`}
        content={
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to archive this planview?
            </p>
          </div>
        }
        confirmLabel="Archive"
        confirmAction={() => {
          if (selectedPlanview) {
            setPlanviews((prevPlanviews) =>
              prevPlanviews.filter(
                (planview) => planview.projectId !== selectedPlanview.projectId
              )
            );
            setArchiveModalOpen(false);
          }
        }}
        cancelLabel="Cancel"
        cancelAction={() => {
          setArchiveModalOpen(false);
        }}
      />
      {/* Modal for confirm delete note */}
      <Modal
        open={deleteNoteModalOpen}
        onClose={() => {}}
        title="Delete Note"
        content={
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this note?
            </p>
          </div>
        }
        confirmLabel="Delete"
        confirmAction={() => {
          if (selectedNote) {
            setProjectNotes((prevNotes) =>
              prevNotes.filter((prevNote) => prevNote.id !== selectedNote.id)
            );
          }
          setSelectedNote(null);
          setDeleteNoteModalOpen(false);
        }}
        cancelLabel="Cancel"
        cancelAction={() => {
          setSelectedNote(null);
          setDeleteNoteModalOpen(false);
        }}
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
