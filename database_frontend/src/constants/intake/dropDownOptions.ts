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

export const businessRegion = [
  "Central East",
  "Central West",
  "East",
  "Northeast",
  "Northwest",
  "Toronto",
  "West",
];

export const buildingTypes = [
  "Business Office",
  "Correctional Institution",
  "Courthouse",
  "Police Detachment",
];

export const hoursOfOperations = [
  "Business Hours",
  "Business Hours incl. weekend",
  "24/7",
];

export const supportLevel = [
  "Justice Grade",
  "Legacy Support",
  "Office Grade",
  "OPP Critical Support",
  "Time & Material",
  "Enhanced",
  "Standard",
  "Basic",
  "Ancilliary",
];

export const levelOfCourt = [
  "Court of Appeal",
  "Ontario Court of Justice",
  "Superior Court of Justice",
  "OCJ/SCJ",
  "N/A",
];

export const solutionType = [
  "Boardroom",
  "Courtroom",
  "Desktop Video",
  "Mobile Cart",
  "Remand Suite",
  "Remote Visit Unit",
  "Telecom/AV room",
  "Other",
];

export const roomFunction: string[] = [
  "Admin Meetings",
  "Bail/Remand Court",
  "Civil Court/Family/Small Claims",
  "Court Appearance",
  "Hearings & Tribunals",
  "Jury Assembly/Selection",
  "Jury Deliberation",
  "Lawyer Consultation",
  "Remote Interpretation",
  "Remote Testimony/Vulnerable Witness",
  "Remote Visits",
  "Training",
  "Trial Court",
  "Other",
];

export const systemControlType: string[] = [
  "Auto-sensing",
  "Button panel",
  "AMX touch panel",
  "Crestron Touch panel",
  "ELO Touch panel",
  "Native Cisco Touch panel",
  "Remote Control",
];

// Features
export const features = [
  { id: "1", feature: "Codec Video Conferencing" },
  { id: "2", feature: "Soft Codec Audio Only" },
  { id: "3", feature: "Soft Codec Video Conferencing" },
  { id: "4", feature: "Mobile Cart Network Availability" },
  { id: "5", feature: "Audio Uplift" },
  { id: "6", feature: "Presentation" },
  { id: "7", feature: "Fixed ALD" },
  { id: "8", feature: "ALD Output Port" },
  { id: "9", feature: "Privacy Switch" },
  { id: "10", feature: "Teleconference Integration" },
  { id: "11", feature: "USD DRD Integration" },
  { id: "12", feature: "Mixer to Mixer DRD Integration" },
  { id: "13", feature: "Simultaneous Interpretation Booth" },
  { id: "14", feature: "Simultaneous Interpretation Input" },
];

export const milestoneStatus = ["Planned", "Completed", "Not Required"];

// Planview
// export const planviewStatus = ["On Track", "Manageable", "Hold", "At Risk"];
export const planviewPhase = [
  "Planning",
  "Implementation",
  "Conditional closeout",
  "Close Out",
  "Completed",
];
