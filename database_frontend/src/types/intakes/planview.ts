// import Note from "./note";

interface Planview {
  planviewId: string;
  projectId: string;
  customer: string;
  workType: string;
  addedToPlanview?: string; // Date string
  overallPhase: string;
  overallStatus: string;
  workDescription: string;
  requestedStart: string; // Date string
  requestedFinish: string; // Date string
}

export default Planview;
