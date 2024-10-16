"use client";
import { useState } from "react";
import { orderStatus } from "@/types/intakes/requisitionOrder";

interface RequisitionOrderTableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  moneyFields: string[];
  tableType:
    | "OneTimeROSInit"
    | "OutstandingMonthlyCostChargeReq"
    | "OneTimeROSChangeReq"
    | "MonthlyRO";
  onStatusClick: (
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
  ) => void;
  onEditClick: (
    row: T,
    tableType:
      | "OneTimeROSInit"
      | "OutstandingMonthlyCostChargeReq"
      | "OneTimeROSChangeReq"
      | "MonthlyRO"
  ) => void;
}

const RequisitionOrderTable = <T extends Record<string, any>>({
  columns,
  data,
  moneyFields,
  tableType,
  onStatusClick,
  onEditClick,
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
                  <span className="sr-only">Edit</span>
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
                        <a
                          onClick={() =>
                            onStatusClick(row.statusHistory, row.id, tableType)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {row[column.key]}
                        </a>
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
                    <a
                      onClick={() => onEditClick(row, tableType)} // Open modal on Edit click
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                      <span className="sr-only">, {row.roNumber}</span>
                    </a>
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
