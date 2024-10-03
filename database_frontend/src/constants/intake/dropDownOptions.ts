export const priorityOptions = ["Low", "Medium", "High", "Critical"];

export const statusOptions = [
  "000 - Init. contact received",
  "005 - Holding off for direction 'A'",
  "010 - Courtesy resp. sent",
  "020 - Priority val'n req. sent-WAITING",
  "022 - Priority val'n answer rec'd -GO",
  "025 - Holding off for direction 'B'",
  "030 - Pre-Intake assess. sched'd",
  "035 - Pre-Intake assess. complete",
  "040 - Pending Executive Approval o.b.o. Client",
  "050 - In Intake",
  "100 - Intake compl. (to Implement'n)",
  "110 - Intake stopped (client aborted)",
  "120 - Intake completed (simple assist)",
  "130 - Intake parked (client may re-init.)",
  "140 - Redirected to another team",
  "150 - Back/over to Operations",
  "160 - Priority val'n req. sent-NO ANSWER",
  "170 - Priority val'n answer rec'd -HOLD",
  "999 - Archived",
];

export const waitingOnContactOptions = [
  "3rd pty.",
  "Client",
  "JVN exec.",
  "JVN intake",
  "JVN man.",
  "JVN PM",
  "JVN preintake",
  "JVN team",
  "Vendor",
];

export const waitingForOptions = [
  "Advice",
  "Assessment",
  "Direction",
  "Drawing(s)",
  "Engage",
  "Follow-up",
  "Form(s)",
  "Funding confirm'n",
  "Info.",
  "Meeting",
  "Prelim.prop'l /cost",
  "Prioritization",
  "Proj. Req. (PR) drafted",
  "Proj. Req. (PR) signed",
  "Re-direct",
  "Response",
  "RO(s)",
  "RO(s) signed",
  "Start",
];

export const clientMinistryOptions = ["AGCY", "MAG", "MCCSS", "MPS", "SOLGEN"];

export const fundingSourceOptions = [
  "OPP",
  "Corr-IS",
  "CSD Local",
  "CSD Corporate",
  "FMB",
  "JTS CIO",
  "LM&G",
  "VHH",
  "Municipal",
  "CSD",
];

export const intakeFormStatusOptions = [
  "000-Requirement TBD",
  "010-Required (to draft eventually)",
  "020-Being drafted",
  "030-Draft waiting internal review",
  "035-Internal review started",
  "040-Ready to table (JVDSC)",
  "050-Follow-up req'd (JVDSC)",
  "055-Ready to re-table (JVDSC)",
  "060-Approved (JVDSC)",
  "070-Ready to table (JVESC)",
  "080-Follow-up req'd (JVESC)",
  "055-Ready to re-table (JVESC)",
  "100-Approved (JVESC+JVDSC)",
  "110-Declined (JVDSC)",
  "120-Declined (JVESC)",
];
