import { Person } from "./person";
export interface OneTimeROSInit {
  id?: string;
  dateAdded: string;
  roNumber: string;
  chargeDescription: string;
  status: orderStatus;
  statusDate: string;
  clientFunding: string;
  roAmount: string;
  costCentre: string;
  approvedBy: Person;
  statusHistory: { status: orderStatus; timestamp: string; current: boolean }[];
}

export interface OutstandingMonthlyCostChargeReq {
  id?: string;
  dateAdded: string;
  crNumber: string;
  roomNumber: string;
  alias: string;
  status: orderStatus;
  statusDate: string;
  ban: string;
  codecConnectivity: string;
  codecSupport: string;
  avMaintSupport: string;
  other: string;
  coreInfraLANSupport: string;
  totalMonthlyRate: string;
  jvnOperationsFee: string;
  costCentre: string;
  statusHistory: { status: orderStatus; timestamp: string; current: boolean }[];
}

export interface OneTimeROSChangeReq {
  id?: string;
  dateAdded: string;
  roNumber: string;
  chargeDescription: string;
  crNumber: string;
  status: orderStatus;
  statusDate: string;
  clientFunding: string;
  roAmount: string;
  costCentre: string;
  approvedBy: Person;
  statusHistory: { status: orderStatus; timestamp: string; current: boolean }[];
}

export interface MonthlyRO {
  id?: string;
  dateAdded: string;
  roNumber: string;
  roomNumber: string;
  alias: string;
  status: orderStatus;
  statusDate: string;
  ban: string;
  chargeType: string;
  codecConnectivity: string;
  codecSupport: string;
  avMaintSupport: string;
  other: string;
  coreInfraLANSupport: string;
  totalMonthlyRate: string;
  jvnOperationsFee: string;
  costCentre: string;
  startStopDate: string;
  statusHistory: { status: orderStatus; timestamp: string; current: boolean }[];
}

export type orderStatus =
  | "RO Created"
  | "RO sent to Client for Approval"
  | "Client Approval Received"
  | "Pending JVN Approval"
  | "Pending CIO Approval"
  | "Sent to Bell/Vendor";
