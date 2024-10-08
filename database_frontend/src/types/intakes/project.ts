import { Person } from "./person";

export interface Project {
  projectId: string;
  projectName: string;
  projectDescription: string;
  priority: string;
  onOppList: boolean;
  deadline: string;
  firstContactDate: string;
  alias?: string;
  status: string;
  implemented: boolean;
  waitingOnContact: string;
  waitingFor: string;
  assignedTo: Person;
  clientMinistry: string;
  folderName: string;
  intakeFormStatus: string;
  lastComm: string;
  clientContacts: Person[];
  assocReferenceNo: string;
  fundingSource: string;
  noteLog: { description: string; user: string; timestamp: string }[];
  locationName?: string;
  address?: string;
  rooms?: { id: string; num: string }[];
  projectSponsor?: string;
  ministry?: string;
  division?: string;
  branchUnit?: string;
  requestedCompletionDate?: string;
  assignedToPM?: string;
  confirmed?: boolean;
  estimatedCost?: { cost: number; year: number }[];
}
