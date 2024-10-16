export type MilestoneKey =
  | "Floor Plans"
  | "Site Visit (If required)"
  | "CRM Conceptual/Rearward"
  | "Cabinet Design"
  | "Client Design Document Walkthrough"
  | "Floor Plan Markup and JVN LAN Marking"
  | "Facilities Scope of Work Submitted to IO"
  | "Functional Design Document Created"
  | "Pictures/Initial Info Request"
  | "Pictures Received"
  | "Design Brief Meeting with Client"
  | "Conceptual Created by ET"
  | "FSOW Issued"
  | "Equipment by Position Issued"
  | "FSOW Sent MAS/FMB"
  | "PSIF Issued"
  | "FDD Completed by JVN"
  | "FDD Client Approved"
  | "ET Proposal Received"
  | "Requisition Orders Created"
  | "VHH Sign-Off RO"
  | "CSO Sign-Off RO"
  | "Package Sent to Bell"
  | "Equipment Orders"
  | "Equipment Staging & Programming"
  | "Equipment Deliveries"
  | "Network Circuit Install or Uplift"
  | "AV Install";

export interface Milestone {
  forecastedDate: string | null;
  completedDate: string | null;
  status: string;
}
