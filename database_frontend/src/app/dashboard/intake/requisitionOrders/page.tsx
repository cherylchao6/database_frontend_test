"use client";
import { useState } from "react";
import {
  OneTimeROSInit,
  OutstandingMonthlyCostChargeReq,
  OneTimeROSChangeReq,
  MonthlyRO,
  orderStatus,
} from "@/types/intakes/requisitionOrder";
import { Person } from "@/types/intakes/person";
import RequisitionOrderTable from "@/components/RequisitionOrderTable";
import Modal from "@/components/Modal";
import DynamicSearchListbox from "@/components/DynamicSearchListbox";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const fetchUsersFromApi = async (query: string) => {
  const response = await fetch(`${apiUrl}/users?name=${query}`);
  return await response.json(); // Returns the people data
};

const fakeOneTimeROSInits: OneTimeROSInit[] = [
  {
    id: "1",
    dateAdded: "2021-07-01",
    roNumber: "123456",
    chargeDescription: "Initial Design",
    status: "RO sent to Client for Approval",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "1000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    chargeDescription: "Initial Design",
    status: "RO Created",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "500",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    statusHistory: [
      { status: "RO Created", timestamp: "2023-04-21", current: true },
      {
        status: "RO sent to Client for Approval",
        timestamp: "",
        current: false,
      },
      { status: "Client Approval Received", timestamp: "", current: false },
      { status: "Pending JVN Approval", timestamp: "", current: false },
      { status: "Pending CIO Approval", timestamp: "", current: false },
      { status: "Sent to Bell/Vendor", timestamp: "", current: false },
    ],
  },
  {
    id: "3",
    dateAdded: "2023-07-05",
    roNumber: "123456",
    chargeDescription: "Initial Design",
    status: "Pending CIO Approval",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "10000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    chargeDescription: "Initial Design",
    status: "RO Created",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "10000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    chargeDescription: "Initial Design",
    status: "RO Created",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "10000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    chargeDescription: "Initial Design",
    crNumber: "123456",
    status: "RO Created",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "1000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    chargeDescription: "Initial Design",
    crNumber: "123456",
    status: "RO Created",
    statusDate: "2021-07-01",
    clientFunding: "Client Funded",
    roAmount: "1000",
    costCentre: "123456",
    approvedBy: {
      id: 1,
      name: "Wade Cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
    roNumber: "123456",
    roomNumber: "123",
    alias: "Alias",
    status: "RO Created",
    statusDate: "2021-07-01",
    ban: "123456",
    chargeType: "Charge Type",
    codecConnectivity: "Codec Connectivity",
    codecSupport: "Codec Support",
    avMaintSupport: "AV Maint Support",
    other: "Other",
    coreInfraLANSupport: "Core Infra LAN Support",
    totalMonthlyRate: "1000",
    jvnOperationsFee: "1000",
    costCentre: "123456",
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

const fakeOutstandingMonthlyCostChargeReqs: OutstandingMonthlyCostChargeReq[] =
  [
    {
      id: "1",
      dateAdded: "2021-07-01",
      crNumber: "123456",
      roomNumber: "123",
      alias: "Alias",
      status: "RO Created",
      statusDate: "2021-07-01",
      ban: "123456",
      codecConnectivity: "Codec Connectivity",
      codecSupport: "Codec Support",
      avMaintSupport: "AV Maint Support",
      other: "Other",
      coreInfraLANSupport: "Core Infra LAN Support",
      totalMonthlyRate: "1000",
      jvnOperationsFee: "1000",
      costCentre: "123456",
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
      dateAdded: "2021-07-03",
      crNumber: "123456",
      roomNumber: "123",
      alias: "Alias",
      status: "RO Created",
      statusDate: "2021-07-01",
      ban: "123456",
      codecConnectivity: "Codec Connectivity",
      codecSupport: "Codec Support",
      avMaintSupport: "AV Maint Support",
      other: "Other",
      coreInfraLANSupport: "Core Infra LAN Support",
      totalMonthlyRate: "1500",
      jvnOperationsFee: "500",
      costCentre: "123456",
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
      id: "3",
      dateAdded: "2023-07-03",
      crNumber: "123456",
      roomNumber: "123",
      alias: "Alias",
      status: "RO Created",
      statusDate: "2021-07-01",
      ban: "123456",
      codecConnectivity: "Codec Connectivity",
      codecSupport: "Codec Support",
      avMaintSupport: "AV Maint Support",
      other: "Other",
      coreInfraLANSupport: "Core Infra LAN Support",
      totalMonthlyRate: "100",
      jvnOperationsFee: "10000",
      costCentre: "123456",
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
  { key: "clientFunding", label: "Client Funding" },
  { key: "roAmount", label: "RO Amount" },
  { key: "costCentre", label: "Cost Centre" },
  { key: "approvedBy", label: "Approved By" },
];

const OutstandingMonthlyCostChargeReqColumns: {
  key: keyof OutstandingMonthlyCostChargeReq;
  label: string;
}[] = [
  { key: "dateAdded", label: "Date Added" },
  { key: "crNumber", label: "CR Number" },
  { key: "roomNumber", label: "Room Number" },
  { key: "alias", label: "Alias" },
  { key: "status", label: "Status" },
  { key: "statusDate", label: "Status Date" },
  { key: "ban", label: "BAN" },
  { key: "codecConnectivity", label: "Codec Connectivity" },
  { key: "codecSupport", label: "Codec Support" },
  { key: "avMaintSupport", label: "AV Maint Support" },
  { key: "other", label: "Other" },
  { key: "coreInfraLANSupport", label: "Core Infra LAN Support" },
  { key: "totalMonthlyRate", label: "Total Monthly Rate" },
  { key: "jvnOperationsFee", label: "JVN Operations Fee" },
  { key: "costCentre", label: "Cost Centre" },
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
  { key: "clientFunding", label: "Client Funding" },
  { key: "roAmount", label: "RO Amount" },
  { key: "costCentre", label: "Cost Centre" },
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
  { key: "other", label: "Other" },
  { key: "coreInfraLANSupport", label: "Core Infra LAN Support" },
  { key: "totalMonthlyRate", label: "Total Monthly Rate" },
  { key: "jvnOperationsFee", label: "JVN Operations Fee" },
  { key: "costCentre", label: "Cost Centre" },
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

  const [
    outstandingMonthlyCostChargeReqs,
    setOutstandingMonthlyCostChargeReqs,
  ] = useState<OutstandingMonthlyCostChargeReq[]>(
    fakeOutstandingMonthlyCostChargeReqs
  );

  const [assignedTo, setAssignedTo] = useState<Person[]>([]);

  // State to control the Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentStatusHistory, setCurrentStatusHistory] = useState<
    { status: orderStatus; timestamp: string; current: boolean }[]
  >([]);

  const [currentTableType, setCurrentTableType] = useState<
    | "OneTimeROSInit"
    | "OutstandingMonthlyCostChargeReq"
    | "OneTimeROSChangeReq"
    | "MonthlyRO"
    | null
  >(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // Edit Order Modal Sections
  const [currentRowData, setCurrentRowData] = useState<any>(null);

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
    tableType:
      | "OneTimeROSInit"
      | "OutstandingMonthlyCostChargeReq"
      | "OneTimeROSChangeReq"
      | "MonthlyRO"
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

  // Function to handle status click and open the modal
  const handleStatusClick = (
    statusHistory: {
      status: orderStatus;
      timestamp: string;
      current: boolean;
    }[],
    itemId: string,
    tableType:
      | "OneTimeROSInit"
      | "OutstandingMonthlyCostChargeReq"
      | "OneTimeROSChangeReq"
      | "MonthlyRO"
  ) => {
    setCurrentStatusHistory(statusHistory);
    setCurrentItemId(itemId);
    setCurrentTableType(tableType);
    setIsStatusModalOpen(true);
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

      case "OutstandingMonthlyCostChargeReq":
        updatedTableData = outstandingMonthlyCostChargeReqs.map((item) =>
          item.id === updatedData.id ? updatedData : item
        );
        setOutstandingMonthlyCostChargeReqs(updatedTableData);
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

  const renderFormFields = () => {
    if (!currentTableType) return null;
    // if (!currentRowData || !currentTableType) return null;

    // Define the columns based on the current table type
    let columns: { key: keyof any; label: string }[] = [];

    switch (currentTableType) {
      case "OneTimeROSInit":
        columns = OneTimeROSInitColumns;
        break;
      case "OutstandingMonthlyCostChargeReq":
        columns = OutstandingMonthlyCostChargeReqColumns;
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
      .filter((column) => column.key !== "status") // Exclude the "status" field
      .map((column) => (
        <div key={column.key as string} className="my-2 text-left text-m">
          <label className="block font-medium leading-6 text-gray-900 mb-2">
            {column.label}
          </label>

          {/* Check for specific fields to render the correct input types */}
          {column.key === "dateAdded" ? (
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
            <DynamicSearchListbox
              label=""
              assignedTo={assignedTo}
              setAssignedTo={setAssignedTo}
              fetchOptions={fetchUsersFromApi}
            />
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

    console.log("currentStatus", currentStatus);
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

        case "OutstandingMonthlyCostChargeReq":
          const updatedOutstandingReqs = outstandingMonthlyCostChargeReqs.map(
            (item) =>
              item.id === currentItemId
                ? { ...item, statusHistory: currentStatusHistory }
                : item
          );
          setOutstandingMonthlyCostChargeReqs(updatedOutstandingReqs);
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
        Project ID : 123456
      </h2>
      {/* One Time ROS-Initial Design Table Section */}
      <div>
        <div className="flex justify-between">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            One Time ROS-Initial Design
          </h2>
          <a
            onClick={() => {
              setCurrentTableType("OneTimeROSInit");
              setIsCreateModalOpen(true);
            }}
            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create New
          </a>
        </div>

        {/* One Time ROS-Initial Design Table Section */}
        <RequisitionOrderTable
          columns={OneTimeROSInitColumns}
          data={oneTimeROSInits}
          moneyFields={["roAmount"]}
          tableType="OneTimeROSInit"
          onStatusClick={(statusHistory, itemId) =>
            handleStatusClick(statusHistory, itemId, "OneTimeROSInit")
          }
          onEditClick={handleEditClick}
        />
      </div>
      {/* One Time ROS-Change Request Table Section */}
      <div className="mt-8">
        <div className="flex justify-between">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            One Time ROS-Change Request
          </h2>
          <a
            onClick={() => {
              setCurrentTableType("OneTimeROSChangeReq");
              setIsCreateModalOpen(true);
            }}
            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create New
          </a>
        </div>

        <RequisitionOrderTable
          columns={OneTimeROSChangeReqColumns}
          data={oneTimeROSChangeReqs}
          moneyFields={["roAmount"]}
          tableType="OneTimeROSChangeReq"
          onStatusClick={(statusHistory, itemId) =>
            handleStatusClick(statusHistory, itemId, "OneTimeROSChangeReq")
          }
          onEditClick={handleEditClick}
        />
      </div>
      {/* Monthly RO Table Section */}
      <div className="mt-8">
        <div className="flex justify-between">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            Monthly RO
          </h2>
          <a
            onClick={() => {
              setCurrentTableType("MonthlyRO");
              setIsCreateModalOpen(true);
            }}
            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create New
          </a>
        </div>

        <RequisitionOrderTable
          columns={MonthlyROColumns}
          data={monthlyROs}
          moneyFields={["totalMonthlyRate", "jvnOperationsFee"]}
          tableType="MonthlyRO"
          onStatusClick={(statusHistory, itemId) =>
            handleStatusClick(statusHistory, itemId, "MonthlyRO")
          }
          onEditClick={handleEditClick}
        />
      </div>
      {/* Outstanding Monthly Cost Charge Req Table Section */}
      <div className="mt-8">
        <div className="flex justify-between">
          <h2 className="col-span-6 text-lg font-semibold text-slate-900">
            Outstanding Monthly Cost Charge Request
          </h2>
          <a
            onClick={() => {
              setCurrentTableType("OutstandingMonthlyCostChargeReq");
              setIsCreateModalOpen(true);
            }}
            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create New
          </a>
        </div>
        <RequisitionOrderTable
          columns={OutstandingMonthlyCostChargeReqColumns}
          data={outstandingMonthlyCostChargeReqs}
          moneyFields={["totalMonthlyRate", "jvnOperationsFee"]}
          tableType="OutstandingMonthlyCostChargeReq"
          onStatusClick={(statusHistory, itemId) =>
            handleStatusClick(
              statusHistory,
              itemId,
              "OutstandingMonthlyCostChargeReq"
            )
          }
          onEditClick={handleEditClick}
        />
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
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="checkbox"
                        checked={historyItem.current}
                        onChange={() => handleCurrentStatusChange(index)}
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
        confirmAction={() => handleSaveEdit(currentRowData)}
        cancelLabel="Cancel"
      />
      <hr className="my-6 border-t border-gray-300" />
      <div className="flex mt-10 justify-end">
        <div className="">
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
