"use client";
import { useState, useEffect } from "react";
import { Hourglass } from "react-loader-spinner";
import { usePathname, useRouter } from "next/navigation";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Project } from "@/types/intakes/project";
import ProjectForm from "@/components/ProjectForm";

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const UpdateProjectPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const projectId = pathname.split("/").pop();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);

  const fakeData: Project = {
    projectId: projectId || "MAG-516-B+-67", // Use the project ID from the URL
    projectName: "Super Fun Project", // Project Name
    projectDescription: "Brampton-7755 Hurontario St-Ctrm-401-SCJ",
    priority: "Low",
    onOppList: true, // This is for the "On Opp List?" checkbox
    implemented: false, // This is for the "In Implementation Phase?" checkbox
    deadline: "2024-12-03T10:30:00Z", // As seen in your screenshot
    firstContactDate: "2024-10-03T10:30:00Z", // First Contact Date
    status: "100 - Intake compl. (to Implement'n)", // Status field
    alias: "5200073", // Alias field
    waitingOnContact: "Client",
    waitingFor: "Response",
    assignedTo: {
      id: 1,
      name: "Devesh Gupta",
      avatar: "https://i.ibb.co/B6ygD2G/devesh.png",
    },
    clientMinistry: "MAG", // Client Ministry
    folderName: "Brampton-7755 Hurontario St-Ctrm-401-SCJ", // Folder Name if exists
    intakeFormStatus: "100-Approved (JVESC+JVDSC)", // Intake from Status
    lastComm: "2024-11-03T10:30:00Z", // Last Communication (Out Bound)
    clientContacts: [
      {
        id: 3,
        name: "Anthony Permell",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
      },
      {
        id: 4,
        name: "Tom Cook",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ], // Client Contact field
    assocReferenceNo: ["REF-2022-001"], // Associated Reference No. if exists
    fundingSource: "VHH", // Funding Source
    noteLog: [
      {
        description: "Initial contact made",
        user: "Derek Pert",
        timestamp: "2024-12-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "Derek Pert",
        timestamp: "2024-11-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "Derek Pert",
        timestamp: "2024-10-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "Derek Pert",
        timestamp: "2024-09-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "Derek Pert",
        timestamp: "2024-08-03T10:30:00Z",
      },
      {
        description: "Follow-up email sent",
        user: "Derek Pert",
        timestamp: "2024-07-03T10:30:00Z",
      },
    ], // Note log array
    locationName: "Brampton Courthouse", // Location Name
    address: "7755 Hurontario Street, Brampton, Ontario L6W 4T1", // Address field
    rooms: [
      { id: "000001", num: "Ctrm401" },
      { id: "000002", num: "Ctrm402" },
      { id: "000003", num: "Ctrm403" },
      { id: "000004", num: "Ctrm404" },
    ], // Room numbers
    projectSponsor: "Arizona Department of Infrastructure", // Project Sponsor
    ministry: "MAG", // Ministry field
    division: "Court Services", // Division field
    branchUnit: "Brampton (A. Grenville and William Davis) Courthouse", // Branch/Unit field
    requestedCompletionDate: "2023-12-31", // Requested Completion Date
    assignedToPM: "Michael Johnson", // Assigned to PM field
    confirmed: true, // Confirmed checkbox
    estimatedCost: [
      { cost: 5000, year: 2021 },
      { cost: 3000, year: 2022 },
      { cost: 600, year: 2023 },
      { cost: 44000, year: 2024 },
      { cost: 33300, year: 2025 },
    ], // Estimated cost
  };

  // Fetch project data based on the project ID from the URL
  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  const fetchProjectData = async (projectId: string) => {
    try {
      // const response = await fetch(`${apiUrl}/projects/${projectId}`);
      // if (!response.ok) {
      //   throw new Error("Failed to fetch project data");
      // }
      // const data: Project = await response.json();
      // setProjectData(data);
      console.log("projectId", projectId);
      setProjectData(fakeData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleSave = async (updatedProjectData: Project) => {
    try {
      // const response = await fetch(`${apiUrl}/projects/${projectId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(updatedProjectData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to update project");
      // }
      console.log("updatedProjectData", updatedProjectData);
      alert("Project updated successfully!");
      router.push("/dashboard/intake/projects");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (loading) {
    return (
      <div className="mt-4 flex justify-center items-center min-h-screen flex-col">
        <p className="mb-4 text-m">Loading project data...</p>
        <Hourglass height="80" width="80" ariaLabel="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-700">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ProjectForm
        initialProjectData={projectData!}
        isEditMode={true}
        onSave={handleSave}
      />
    </div>
  );
};

export default UpdateProjectPage;
