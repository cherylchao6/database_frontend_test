import Note from "./note";
import { Ministry } from "../organization";

export type PlanviewPhase =
  | "Planning"
  | "Implementation"
  | "Conditional Closeout"
  | "Close Out"
  | "Completed";

export const planviewPhases: PlanviewPhase[] = [
  "Planning",
  "Implementation",
  "Conditional Closeout",
  "Close Out",
  "Completed",
];

export type PlanviewStatus = "On Track" | "Manageable" | "On Hold" | "Canceled";

export const planviewStatuses: PlanviewStatus[] = [
  "On Track",
  "Manageable",
  "On Hold",
  "Canceled",
];

interface Planview {
  planviewId: string;
  phase: PlanviewPhase;
  status: PlanviewStatus;
  requestedStartDate: string;
  requestedFinishDate: string;
  projectId: string;
  projectMinistry: Ministry;
  projectName: string;
  projectDescription: string;
  projectNotes: Note[];
}

export default Planview;
