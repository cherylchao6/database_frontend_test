"use client";
import { useState } from "react";
import { Project } from "@/types/intakes/project";
import ProjectForm from "@/components/ProjectForm";
import { useRouter } from "next/navigation";

const initialProjectData: Project = {
  projectId: "",
  projectName: "",
  projectDescription: "",
  priority: "",
  onOppList: false,
  deadline: "",
  firstContactDate: "",
  status: "",
  alias: "",
  implemented: false,
  waitingOnContact: "",
  waitingFor: "",
  clientMinistry: "",
  folderName: "",
  intakeFormStatus: "",
  lastComm: "",
  clientContacts: [],
  assocReferenceNo: [],
  fundingSource: "",
  noteLog: [],
  locationName: "",
  address: "",
  rooms: [],
  projectSponsor: "",
  ministry: "",
  division: "",
  branchUnit: "",
  requestedCompletionDate: "",
  assignedToPM: "",
  confirmed: false,
  estimatedCost: [],
};

const CreateProjectPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (newProjectData: Project) => {
    try {
      // const response = await fetch(`${apiUrl}/projects`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newProjectData),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to create project");
      // }

      console.log("newProjectData", newProjectData);

      alert("Project created successfully!");
      router.push("/dashboard/intake/projects");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-700">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <ProjectForm
        initialProjectData={initialProjectData}
        isEditMode={false}
        onSave={handleSave}
      />
    </div>
  );
};

export default CreateProjectPage;
