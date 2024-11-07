"use client";
import { useState } from "react";
import { OrderStatus } from "@/types/intakes/requisitionOrder";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface RequisitionOrderTableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  moneyFields: string[];
  tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO";
  onStatusClick: (
    statusHistory: {
      status: OrderStatus;
      timestamp: string;
      current: boolean;
    }[],
    itemId: string,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO",
    order: T
  ) => void;
  onEditClick: (
    row: T,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO"
  ) => void;
  onCancelClick: (
    row: T,
    tableType: "OneTimeROSInit" | "OneTimeROSChangeReq" | "MonthlyRO"
  ) => void;
}

const RequisitionOrderTable = <T extends Record<string, any>>({
  columns,
  data,
  moneyFields,
  tableType,
  onStatusClick,
  onEditClick,
  onCancelClick,
}: RequisitionOrderTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (columnKey: string) => {
    const isAsc = sortColumn === columnKey && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(columnKey);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof T];
    const bValue = b[sortColumn as keyof T];

    if (moneyFields.includes(sortColumn)) {
      const aNum = parseFloat(aValue as string) || 0;
      const bNum = parseFloat(bValue as string) || 0;
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }

    return sortDirection === "asc"
      ? (aValue as string).localeCompare(bValue as string)
      : (bValue as string).localeCompare(aValue as string);
  });

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key as string}
                    scope="col"
                    className={`sticky top-0 z-10 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 bg-gray-100 ${
                      column.key === "dateAdded" ||
                      moneyFields.includes(column.key as string)
                        ? "hover:bg-gray-200 hover:text-indigo-600 cursor-pointer"
                        : ""
                    }`}
                    onClick={() =>
                      column.key === "dateAdded" ||
                      moneyFields.includes(column.key as string)
                        ? handleSort(column.key as string)
                        : null
                    }
                  >
                    {column.label}
                    {(column.key === "dateAdded" ||
                      moneyFields.includes(column.key as string)) && (
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
                  className="sticky top-0 z-10 py-3.5 pl-3 pr-4 sm:pr-3 bg-gray-100"
                >
                  <span className="sr-only ">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-3 text-gray-900"
                    >
                      {column.key === "status" ? (
                        row.status ? (
                          <a
                            onClick={() => {
                              onStatusClick(
                                row.statusHistory,
                                row.id,
                                tableType,
                                row
                              );
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {row[column.key]}
                          </a>
                        ) : (
                          <span
                            className="text-indigo-600 cursor-pointer"
                            onClick={() =>
                              onStatusClick(
                                row.statusHistory,
                                row.id,
                                tableType,
                                row
                              )
                            }
                          >
                            Click to Add Status
                          </span>
                        )
                      ) : column.key === "approvedBy" ? (
                        // Render the name property of the approvedBy object
                        row[column.key]?.name || "NONE"
                      ) : moneyFields.includes(column.key as string) ? (
                        `$${row[column.key]}`
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                    {row.status === "Client Approval Received" ? (
                      <a
                        onClick={() => onCancelClick(row, tableType)}
                        className="text-red-600 hover:text-red-800 cursor-pointer relative group"
                      >
                        Cancel
                        <span className="sr-only">, {row.roNumber}</span>
                        <div className="absolute z-50 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-3 py-2 shadow-lg whitespace-normal min-w-60 text-left">
                          <InformationCircleIcon className="inline w-4 h-4 mr-1 text-blue-400" />
                          Once the Order status is &quot;Client Approval
                          Received&quot;, it cannot be modified. To make
                          changes, please cancel this order and create a new
                          one.
                        </div>
                      </a>
                    ) : (
                      <a
                        onClick={() => onEditClick(row, tableType)}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        Edit
                        <span className="sr-only">, {row.roNumber}</span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequisitionOrderTable;
