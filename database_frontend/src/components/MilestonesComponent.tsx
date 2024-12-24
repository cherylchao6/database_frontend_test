import React, { useEffect } from "react";
import { Milestone, MilestoneKey } from "@/types/intakes/milestone";
import {
  CheckIcon,
  XMarkIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { milestoneStatus } from "constants/intake/dropDownOptions";

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

const emptyMilestones: Record<MilestoneKey, Milestone> = {
  "Floor Plans": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Site Visit (If required)": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "CRM Conceptual/Rearward": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Cabinet Design": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Client Design Document Walkthrough": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Floor Plan Markup and JVN LAN Marking": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Facilities Scope of Work Submitted to IO": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Functional Design Document Created": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Pictures/Initial Info Request": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Pictures Received": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Design Brief Meeting with Client": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Conceptual Created by ET": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "FSOW Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Equipment by Position Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "FSOW Sent MAS/FMB": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "PSIF Issued": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "FDD Completed by JVN": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "FDD Client Approved": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "ET Proposal Received": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Requisition Orders Created": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "VHH Sign-Off RO": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "CSO Sign-Off RO": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Package Sent to Bell": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Equipment Orders": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Equipment Staging & Programming": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Equipment Deliveries": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "Network Circuit Install or Uplift": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
  "AV Install": {
    forecastedDate: null,
    completedDate: null,
    status: "",
  },
};

interface MilestonesComponentProps {
  projectId: string;
  milestones: Record<string, any>;
  setMilestones: (milestones: Record<string, any>) => void;
}

const MilestonesComponent: React.FC<MilestonesComponentProps> = ({
  projectId,
  milestones,
  setMilestones,
}) => {
  useEffect(() => {
    if (!projectId) {
      setMilestones(emptyMilestones);
      return;
    }

    const fetchMilestones = async () => {
      try {
        // const response = await fetch(`/api/projects/${projectId}/milestones`);
        // if (!response.ok) {
        //   throw new Error("Failed to fetch milestones");
        // }
        // const data = await response.json();
        setMilestones(fakeMilestones);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }
    };
    fetchMilestones();
  }, [projectId, setMilestones]);

  const handleMilestoneDateChange = (
    key: MilestoneKey,
    field: "forecastedDate" | "completedDate",
    value: string
  ) => {
    setMilestones((prev: Record<string, Milestone>) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleMilestoneStatusChange = (key: MilestoneKey, value: string) => {
    setMilestones((prev: Record<string, Milestone>) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: value,
      },
    }));
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "Planned":
        return (
          <DocumentCheckIcon className="h-5 w-5 text-blue-500 inline-block mr-2" />
        );
      case "Completed":
        return (
          <CheckIcon className="h-5 w-5 text-green-500 inline-block mr-2" />
        );
      case "Not Required":
        return (
          <XMarkIcon className="h-5 w-5 text-gray-400 inline-block mr-2" />
        );
      default:
        return null;
    }
  };

  return (
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
  );
};

export default MilestonesComponent;
