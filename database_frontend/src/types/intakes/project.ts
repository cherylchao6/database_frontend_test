import { Person } from "./person";
import { Note } from "./note";

interface Location {
  id: number | null;
  name: string;
  address: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  description: string;
  priority: string;
  onOpsList: boolean;
  deadline: string;
  firstContactDate: string;
  alias?: string;
  status: string;
  implemented: boolean;
  waitingOn: string;
  waitingFor: string;
  assignedTo?: Person;
  clientMinistry: string;
  folderName: string;
  intakeFormStatus: string;
  lastComm: string;
  clientContacts: Person[];
  assocReferenceNos: { id?: number; assocReferenceNo: string }[];
  fundingSource: string;
  noteLogs: Note[];
  location?: Location;
  rooms?: { id: string; num: string }[];
  projectSponsor?: string;
  ministry?: string;
  division?: string;
  branch?: string;
  requestedCompletionDate?: string;
  assignedToPM?: boolean;
  estimatedCosts?: { id?: number; cost: number; year: number }[];
}
