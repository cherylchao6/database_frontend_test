"use client";
import { useState } from "react";
import {
  OneTimeROSInit,
  OneTimeROSChangeReq,
  MonthlyRO,
  OrderStatus,
  ChargeType,
} from "@/types/intakes/requisitionOrder";
import { Person } from "@/types/intakes/person";
import RequisitionOrderTable from "@/components/RequisitionOrderTable";
import Modal from "@/components/Modal";
import DynamicSearchPeopleListbox from "@/components/DynamicSearchPeopleListbox";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const fetchUsersFromApi = async (query: string) => {
  const response = await fetch(`${apiUrl}/users?name=${query}`);
  return await response.json(); // Returns the people data
};

const fakeOneTimeROSInits: OneTimeROSInit[] = [
  {
    id: "1",
    dateAdded: "2021-07-01",
    roNumber: "MAG-516-B+-67-RO101",
    chargeDescription: "One Time Costs Equipment",
    status: "RO sent to Client for Approval",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "156000",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "2",
    dateAdded: "2021-07-05",
    roNumber: "MAG-516-B+-67-RO102",
    chargeDescription: "One Time Costs Training",
    status: "Client Approval Received",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "2400",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-05-21",
        current: false,
      },
      {
        status: "Client Approval Received",
        timestamp: "2023-06-21",
        current: true,
      },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "3",
    dateAdded: "2023-07-05",
    roNumber: "MAG-516-B+-67-RO103",
    chargeDescription: "One Time Costs Training",
    status: "Pending CIO Approval",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "2000",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2022-12-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-01-21",
        current: false,
      },
      {
        status: "Client Approval Received",
        timestamp: "2023-02-21",
        current: false,
      },
      {
        status: "Pending JVN Approval",
        timestamp: "2023-03-21",
        current: false,
      },
      {
        status: "Pending CIO Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "4",
    dateAdded: "2023-07-05",
    roNumber: "MAG-516-B+-67-RO104",
    chargeDescription: "One Time Costs Training",
    status: "RO Created",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "2300",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "5",
    dateAdded: "2023-07-05",
    roNumber: "MAG-516-B+-67-RO105",
    chargeDescription: "One Time Costs Training",
    status: "RO Created",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "2100",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
];

const fakeOneTimeROSChangeReqs: OneTimeROSChangeReq[] = [
  {
    id: "1",
    dateAdded: "2021-07-01",
    roNumber: "MAG-516-B+-67-RO301",
    chargeDescription: "Codec switch",
    crNumber: "CR-1",
    status: "RO Created",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "1000",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "2",
    dateAdded: "2021-07-01",
    roNumber: "MAG-316-B+-67-RO302",
    chargeDescription: "Initial Design",
    crNumber: "CR-2",
    status: "RO Created",
    statusDate: "2021-07-01",
    initiative: "VHH",
    roAmount: "1000",
    costCenter: "003-030101-0000-040945-531800-0000",
    approvedBy: {
      id: 6,
      name: "Charles Zhang",
      avatar: "https://i.postimg.cc/Njpp3S7j/charles.png",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
];

const fakeMonthlyROs: MonthlyRO[] = [
  {
    id: "1",
    dateAdded: "2021-07-01",
    roNumber: "MAG-316-B+-67-RO201",
    roomNumber: "Ctrm 10",
    alias: "AUD1094",
    status: "RO Created",
    statusDate: "2021-07-01",
    ban: "552286984",
    chargeType: "Add",
    codecConnectivity: "130",
    codecSupport: "128",
    avMaintSupport: "765.24",
    coreInfraLANSupport: "0",
    jvnOperationsFee: "250",
    callCtrlAndcommuManagement: "2000",
    other: "0",
    totalMonthlyRate: "3273.24",
    costCenter: "003-030501-0601-075025",
    startStopDate: "2021-07-01",
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "2023-04-21",
        current: true,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
];

// Organize the columns for all order table columns
const OneTimeROSInitColumns: { key: keyof OneTimeROSInit; label: string }[] = [
  { key: "dateAdded", label: "Date Added" },
  { key: "roNumber", label: "RO Number" },
  { key: "chargeDescription", label: "Charge Description" },
  { key: "status", label: "Status" },
  { key: "statusDate", label: "Status Date" },
  { key: "initiative", label: "Initiative" },
  { key: "roAmount", label: "RO Amount" },
  { key: "costCenter", label: "Cost Center" },
  { key: "approvedBy", label: "Approved By" },
];

const OneTimeROSChangeReqColumns: {
  key: keyof OneTimeROSChangeReq;
  label: string;
}[] = [
  { key: "dateAdded", label: "Date Added" },
  { key: "roNumber", label: "RO Number" },
  { key: "chargeDescription", label: "Charge Description" },
  { key: "crNumber", label: "CR Number" },
  { key: "status", label: "Status" },
  { key: "statusDate", label: "Status Date" },
  { key: "initiative", label: "Client Funding" },
  { key: "roAmount", label: "RO Amount" },
  { key: "costCenter", label: "Cost Center" },
  { key: "approvedBy", label: "Approved By" },
];

const MonthlyROColumns: { key: keyof MonthlyRO; label: string }[] = [
  { key: "dateAdded", label: "Date Added" },
  { key: "roNumber", label: "RO Number" },
  { key: "roomNumber", label: "Room Number" },
  { key: "alias", label: "Alias" },
  { key: "status", label: "Status" },
  { key: "statusDate", label: "Status Date" },
  { key: "ban", label: "BAN" },
  { key: "chargeType", label: "Charge Type" },
  { key: "codecConnectivity", label: "Codec Connectivity" },
  { key: "codecSupport", label: "Codec Support" },
  { key: "avMaintSupport", label: "AV Maint Support" },
  { key: "coreInfraLANSupport", label: "Core Infra LAN Support" },
  { key: "jvnOperationsFee", label: "JVN Operations Fee" },
  {
    key: "callCtrlAndcommuManagement",
    label: "Call Control & Communication Management",
  },
  { key: "other", label: "Other" },
  { key: "totalMonthlyRate", label: "Total Monthly Rate" },
  { key: "costCenter", label: "Cost Center" },
  { key: "startStopDate", label: "Start/Stop Date" },
];

const RequisitionOrdersPage = () => {
  const [error, setError] = useState<string | null>(null);
  // State for data
  const [oneTimeROSInits, setOneTimeROSInits] =
    useState<OneTimeROSInit[]>(fakeOneTimeROSInits);

  const [oneTimeROSChangeReqs, setOneTimeROSChangeReqs] = useState<
    OneTimeROSChangeReq[]
  >(fakeOneTimeROSChangeReqs);

  const [monthlyROs, setMonthlyROs] = useState<MonthlyRO[]>(fakeMonthlyROs);

  const [assignedTo, setAssignedTo] = useState<Person[]>([]);

  // State to control the Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentStatusHistory, setCurrentStatusHistory] = useState<
    { status: OrderStatus; timestamp: string; current: boolean }[]
  >([]);
  const [isCreateOptionModalOpen, setIsCreateOptionModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [currentTableType, setCurrentTableType] = useState<
    "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO" | null
  >(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // Edit Order Modal Sections
  const [currentRowData, setCurrentRowData] = useState<any>(null);

  // Control the display of order tables
  const [isOneTimeROSInitTableShown, setIsOneTimeROSInitTableShown] =
    useState(true);
  const [isOneTimeROSChangeReqTableShown, setIsOneTimeROSChangeReqTableShown] =
    useState(false);
  const [isMonthlyROTableShown, setIsMonthlyROTableShown] = useState(false);
  const toggleOneTimeROSInitTableShow = () => {
    setIsOneTimeROSInitTableShown(!isOneTimeROSInitTableShown);
  };
  const toggleOneTimeROSChangeReqTableShow = () => {
    setIsOneTimeROSChangeReqTableShown(!isOneTimeROSChangeReqTableShown);
  };
  const toggleMonthlyROTableShow = () => {
    setIsMonthlyROTableShown(!isMonthlyROTableShown);
  };

  const handleCostCenterChange = (
    value: string,
    partIndex: number,
    key: string
  ) => {
    setCurrentRowData((prevData: any) => {
      const parts = prevData[key]?.split("-") || ["", "", "", ""];
      parts[partIndex] = value;
      return {
        ...prevData,
        [key]: parts.join("-"),
      };
    });
  };

  // useEffect(() => {
  //   if (currentTableType && currentRowData) {
  //     const initialPerson = currentRowData["approvedBy"] as Person | null;
  //     if (initialPerson) {
  //       setAssignedTo([initialPerson]);
  //     } else {
  //       setAssignedTo([]);
  //     }
  //   }
  // }, [currentTableType, currentRowData]);

  const handleEditClick = (
    row: any,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO"
  ) => {
    setCurrentRowData(row); // Store the row data to edit
    setCurrentTableType(tableType); // Set the current table type
    if (row.approvedBy) {
      setAssignedTo([row.approvedBy]); // Set the initial person
    } else {
      setAssignedTo([]);
    }

    setIsEditModalOpen(true); // Open modal
  };

  // delete the order
  const handleCancelClick = (
    row: any,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO"
  ) => {
    setCurrentRowData(row);
    setCurrentTableType(tableType);
    setIsCancelModalOpen(true);
  };

  // Function to handle status click and open the modal
  const handleStatusClick = (
    statusHistory: {
      status: OrderStatus;
      timestamp: string;
      current: boolean;
    }[],
    itemId: string,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO",
    orderData: any
  ) => {
    setCurrentStatusHistory(statusHistory);
    setCurrentItemId(itemId);
    setCurrentTableType(tableType);
    setIsStatusModalOpen(true);
    setCurrentRowData(orderData);
  };

  // Update row data upon saving
  const handleSaveEdit = (updatedData: any) => {
    let updatedTableData;

    updatedData.approvedBy = assignedTo[0];

    switch (currentTableType) {
      case "OneTimeROSInit":
        updatedTableData = oneTimeROSInits.map((item) =>
          item.id === updatedData.id ? updatedData : item
        );
        setOneTimeROSInits(updatedTableData);
        break;

      case "OneTimeROSChangeReq":
        updatedTableData = oneTimeROSChangeReqs.map((item) =>
          item.id === updatedData.id ? updatedData : item
        );
        setOneTimeROSChangeReqs(updatedTableData);
        break;

      case "MonthlyRO":
        updatedTableData = monthlyROs.map((item) =>
          item.id === updatedData.id ? updatedData : item
        );
        setMonthlyROs(updatedTableData);
        break;

      default:
        break;
    }

    setIsEditModalOpen(false); // Close modal after saving
  };

  const handleCreateOrderSaveClick = (newData: any) => {
    newData.approvedBy = assignedTo[0];
    newData.statusHistory = [
      { status: "RO Created", timestamp: "", current: false },
      {
        status: "RO sent to Client for Approval",
        timestamp: "",
        current: false,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ];

    switch (currentTableType) {
      case "OneTimeROSInit":
        setOneTimeROSInits([...oneTimeROSInits, newData]);
        break;

      case "OneTimeROSChangeReq":
        setOneTimeROSChangeReqs([...oneTimeROSChangeReqs, newData]);
        break;

      case "MonthlyRO":
        setMonthlyROs([...monthlyROs, newData]);
        break;

      default:
        break;
    }

    setIsCreateModalOpen(false);
  };

  // Function to handle canceling the edit
  const handleCancelEdit = () => {
    switch (currentTableType) {
      case "OneTimeROSInit":
        const updatedOneTimeROSInits = oneTimeROSInits.filter(
          (item) => item.id !== currentRowData.id
        );
        setOneTimeROSInits(updatedOneTimeROSInits);
        break;

      case "OneTimeROSChangeReq":
        const updatedROSChangeReqs = oneTimeROSChangeReqs.filter(
          (item) => item.id !== currentRowData.id
        );
        setOneTimeROSChangeReqs(updatedROSChangeReqs);
        break;

      case "MonthlyRO":
        const updatedMonthlyROs = monthlyROs.filter(
          (item) => item.id !== currentRowData.id
        );
        setMonthlyROs(updatedMonthlyROs);
        break;

      default:
        break;
    }
  };

  const renderFormFields = () => {
    if (!currentTableType) return null;
    // if (!currentRowData || !currentTableType) return null;

    // Define the columns based on the current table type
    let columns: { key: keyof any; label: string }[] = [];

    switch (currentTableType) {
      case "OneTimeROSInit":
        columns = OneTimeROSInitColumns;
        break;
      case "OneTimeROSChangeReq":
        columns = OneTimeROSChangeReqColumns;
        break;
      case "MonthlyRO":
        columns = MonthlyROColumns;
        break;
      default:
        return null;
    }

    return columns
      .filter((column) => {
        return column.key !== "status" && column.key !== "statusDate";
      }) // Exclude the "status" and "statusDate" field
      .map((column) => (
        <div key={column.key as string} className="my-2 text-left text-m">
          <label className="block font-medium leading-6 text-gray-900 mb-2">
            {column.label}
          </label>

          {/* Check for specific fields to render the correct input types */}
          {column.key === "dateAdded" || column.key === "startStopDate" ? (
            <input
              type="date"
              value={currentRowData?.[column.key] || ""}
              onChange={(e) =>
                setCurrentRowData({
                  ...currentRowData,
                  [column.key]: e.target.value,
                })
              }
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          ) : column.key === "approvedBy" ? (
            <DynamicSearchPeopleListbox
              label=""
              assignedTo={assignedTo}
              setAssignedTo={setAssignedTo}
              fetchOptions={fetchUsersFromApi}
            />
          ) : column.key === "chargeType" ? (
            <select
              value={currentRowData?.[column.key] || ""}
              onChange={(e) =>
                setCurrentRowData({
                  ...currentRowData,
                  [column.key]: e.target.value as ChargeType,
                })
              }
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Charge Type</option>
              <option value="Add">Add</option>
              <option value="Remove">Remove</option>
            </select>
          ) : column.key === "costCenter" ? (
            <div className="flex flex-col space-y-2">
              {/* 第一行: Balance Unit (3 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Balance Unit (3 digits)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[0] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      0,
                      column.key as string
                    )
                  }
                  className="w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
              </div>

              {/* 第二行: Program (6 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Program (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[1] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      1,
                      column.key as string
                    )
                  }
                  className="w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
              </div>

              {/* 第三行: Business Unit (4 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Business Unit (4 digits)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[2] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      2,
                      column.key as string
                    )
                  }
                  className="w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
              </div>

              {/* 第四行: Cost Center (6 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Cost Center (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[3] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      3,
                      column.key as string
                    )
                  }
                  className="w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                />
              </div>

              {/* 第五行: Account Code (6 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Account Code (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[4] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      4,
                      column.key as string
                    )
                  }
                  className={`w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm ${
                    currentTableType === "MonthlyRO"
                      ? "bg-gray-200 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-indigo-600"
                  }`}
                  disabled={currentTableType === "MonthlyRO"}
                />
              </div>

              {/* 第六行: Initiative Code (8 digits) */}
              <div className="flex items-center space-x-4">
                <label className="w-60 text-right font-medium">
                  Initiative Code (8 digits)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={
                    currentRowData?.[column.key as string]?.split("-")[5] || ""
                  }
                  onChange={(e) =>
                    handleCostCenterChange(
                      e.target.value,
                      5,
                      column.key as string
                    )
                  }
                  className={`w-36 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm ${
                    currentTableType === "MonthlyRO"
                      ? "bg-gray-200 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-indigo-600"
                  }`}
                  disabled={currentTableType === "MonthlyRO"}
                />
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={currentRowData?.[column.key] || ""}
              onChange={(e) =>
                setCurrentRowData({
                  ...currentRowData,
                  [column.key]: e.target.value,
                })
              }
              className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          )}
        </div>
      ));
  };

  // Handle when the user selects a "current" status (only one can be current)
  const handleCurrentStatusChange = (index: number) => {
    const updatedHistory = currentStatusHistory.map((item, i) => ({
      ...item,
      current: i === index, // Set the clicked item as current, others to false
    }));
    setCurrentStatusHistory(updatedHistory);
  };

  // Function to handle updating the status inside the modal
  const handleStatusChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedHistory = [...currentStatusHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value,
    };
    setCurrentStatusHistory(updatedHistory);
  };

  const handleSaveStatus = () => {
    if (!currentItemId || !currentTableType) return;

    // if the set a new current status, the date can't be empty
    const currentStatus = currentStatusHistory.find((item) => item.current);

    if (currentStatus && !currentStatus.timestamp) {
      setError("* Please set a date for the current status");
      return;
    }
    if (currentStatus) {
      switch (currentTableType) {
        case "OneTimeROSInit":
          const updatedOneTimeROSInits = oneTimeROSInits.map((item) =>
            item.id === currentItemId
              ? {
                  ...item,
                  statusHistory: currentStatusHistory,
                  status: currentStatus.status,
                  statusDate: currentStatus.timestamp,
                }
              : item
          );

          setOneTimeROSInits(updatedOneTimeROSInits);
          break;

        case "OneTimeROSChangeReq":
          const updatedROSChangeReqs = oneTimeROSChangeReqs.map((item) =>
            item.id === currentItemId
              ? { ...item, statusHistory: currentStatusHistory }
              : item
          );
          setOneTimeROSChangeReqs(updatedROSChangeReqs);
          break;

        case "MonthlyRO":
          const updatedMonthlyROs = monthlyROs.map((item) =>
            item.id === currentItemId
              ? { ...item, statusHistory: currentStatusHistory }
              : item
          );
          setMonthlyROs(updatedMonthlyROs);
          break;

        default:
          break;
      }
    }

    setError(null);
    setIsStatusModalOpen(false);
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Requisition Orders
        </h1>
      </div>
      <h2 className="col-span-6 text-xl font-semibold text-slate-900 mb-10">
        Project ID : MAG-516-B+-67
      </h2>
      {/* One Time ROS-Initial Design Table Section */}
      <div>
        <div className="flex">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            One Time ROS-Initial Design
          </h2>
          <button
            onClick={toggleOneTimeROSInitTableShow}
            className="flex items-center cursor-pointer focus:outline-none px-2"
          >
            {isOneTimeROSInitTableShown ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {isOneTimeROSInitTableShown && (
          <RequisitionOrderTable
            columns={OneTimeROSInitColumns}
            data={oneTimeROSInits}
            moneyFields={["roAmount"]}
            tableType="OneTimeROSInit"
            onStatusClick={(
              statusHistory,
              itemId,
              tableType,
              currentRowData
            ) => {
              // Now call handleStatusClick with verified parameters
              handleStatusClick(
                statusHistory,
                itemId,
                tableType, // Ensure this is tableType
                currentRowData
              );
            }}
            onEditClick={handleEditClick}
            onCancelClick={handleCancelClick}
          />
        )}
      </div>
      {/* One Time ROS-Change Request Table Section */}
      <div className="mt-8">
        <div className="flex">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            One Time ROS-Change Request
          </h2>
          <button
            onClick={toggleOneTimeROSChangeReqTableShow}
            className="flex items-center cursor-pointer focus:outline-none px-2"
          >
            {isOneTimeROSChangeReqTableShown ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {isOneTimeROSChangeReqTableShown && (
          <RequisitionOrderTable
            columns={OneTimeROSChangeReqColumns}
            data={oneTimeROSChangeReqs}
            moneyFields={["roAmount"]}
            tableType="OneTimeROSChangeReq"
            onStatusClick={(
              statusHistory,
              itemId,
              tableType,
              currentRowData
            ) => {
              handleStatusClick(
                statusHistory,
                itemId,
                tableType,
                currentRowData
              );
            }}
            onEditClick={handleEditClick}
            onCancelClick={handleCancelClick}
          />
        )}
      </div>
      {/* Monthly RO Table Section */}
      <div className="mt-8">
        <div className="flex">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            Monthly RO
          </h2>
          <button
            onClick={toggleMonthlyROTableShow}
            className="flex items-center cursor-pointer focus:outline-none px-2"
          >
            {isMonthlyROTableShown ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {isMonthlyROTableShown && (
          <RequisitionOrderTable
            columns={MonthlyROColumns}
            data={monthlyROs}
            moneyFields={[
              "totalMonthlyRate",
              "jvnOperationsFee",
              "callCtrlAndcommuManagement",
              "commuManagement",
              "other",
              "coreInfraLANSupport",
              "avMaintSupport",
              "codecSupport",
              "codecConnectivity",
            ]}
            tableType="MonthlyRO"
            onStatusClick={(statusHistory, itemId, tableType, currentRowData) =>
              handleStatusClick(
                statusHistory,
                itemId,
                tableType,
                currentRowData
              )
            }
            onEditClick={handleEditClick}
            onCancelClick={handleCancelClick}
          />
        )}
      </div>
      {/* Modal for status change */}
      <Modal
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Status History"
        content={
          <div className="overflow-x-auto">
            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {/* Table for status history */}
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStatusHistory.map((historyItem, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {historyItem.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="date"
                        value={historyItem.timestamp || ""}
                        onChange={(e) =>
                          handleStatusChange(index, "timestamp", e.target.value)
                        }
                        className="border border-gray-300 p-1 rounded"
                        disabled={
                          currentRowData.status === "Client Approval Received"
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="checkbox"
                        checked={historyItem.current}
                        onChange={() => handleCurrentStatusChange(index)}
                        disabled={
                          currentRowData.status === "Client Approval Received"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        confirmLabel="Save"
        confirmAction={handleSaveStatus} // Saving the status changes
        cancelLabel="Cancel"
        cancelAction={() => {
          setCurrentStatusHistory([]);
          setError(null);
        }} // Clear action if needed
      />
      {/* Modal for Editing */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Row"
        content={<div>{renderFormFields()}</div>}
        confirmLabel="Save"
        confirmAction={() => handleSaveEdit(currentRowData)}
        cancelLabel="Cancel"
      />
      {/* Modal for Creating */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Order"
        content={<div>{renderFormFields()}</div>}
        confirmLabel="Save"
        confirmAction={() => handleCreateOrderSaveClick(currentRowData)}
        cancelLabel="Cancel"
      />
      {/* Modal for Choose Type of Order to Create*/}
      <Modal
        open={isCreateOptionModalOpen}
        onClose={() => setIsCreateOptionModalOpen(false)}
        title="Please Choose the Type of Order to Create"
        content={
          <div className="flex justify-center">
            <div className="flex flex-col gap-4 pt-2">
              <a
                onClick={() => {
                  setCurrentTableType("OneTimeROSInit");
                  setIsCreateOptionModalOpen(false);
                  setIsCreateModalOpen(true);
                  setCurrentRowData(null);
                  setAssignedTo([]);
                }}
                className="justify-center cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                One Time ROS-Initial Design
              </a>
              <a
                onClick={() => {
                  setCurrentTableType("OneTimeROSChangeReq");
                  setIsCreateOptionModalOpen(false);
                  setIsCreateModalOpen(true);
                  setCurrentRowData(null);
                  setAssignedTo([]);
                }}
                className="justify-center cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                One Time ROS-Change Request
              </a>

              <a
                onClick={() => {
                  setCurrentTableType("MonthlyRO");
                  setIsCreateOptionModalOpen(false);
                  setIsCreateModalOpen(true);
                  setCurrentRowData(null);
                }}
                className="justify-center cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Monthly RO
              </a>
            </div>
          </div>
        }
        displayCancelLabel={true}
        displayConfirmLabel={false}
      />

      {/* Modal for Canceling */}
      <Modal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Order"
        content={
          <div>
            <p>Are you sure you want to cancel this order?</p>
          </div>
        }
        confirmLabel="Yes"
        confirmAction={() => {
          handleCancelEdit();
          setIsCancelModalOpen(false);
        }}
        cancelLabel="No"
        cancelAction={() => setIsCancelModalOpen(false)}
      />

      <hr className="my-6 border-t border-gray-300" />
      <div className="flex mt-10 justify-end">
        <div className="">
          <a
            onClick={() => setIsCreateOptionModalOpen(true)}
            className="cursor-pointer mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add New Order
          </a>
          <a
            href="/dashboard/intake/projects/MAG-001"
            className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back To Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default RequisitionOrdersPage;
