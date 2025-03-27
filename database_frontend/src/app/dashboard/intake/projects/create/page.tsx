"use client";
import { useState } from "react";
import { Project } from "@/types/intakes/project";
import ProjectForm from "@/components/ProjectForm";
import { useRouter } from "next/navigation";
import { cleanObject } from "@/utils/apiHelper";
import { useSession } from "next-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const initialProjectData: Project = {
  projectId: "",
  projectName: "",
  description: "",
  priority: "",
  onOpsList: false,
  deadline: "",
  firstContactDate: "",
  status: "",
  alias: "",
  implemented: false,
  waitingOn: "",
  waitingFor: "",
  clientMinistry: "",
  folderName: "",
  intakeFormStatus: "",
  lastComm: "",
  clientContacts: [],
  assocReferenceNos: [],
  fundingSource: "",
  noteLogs: [],
  rooms: [],
  projectSponsor: "",
  ministry: "",
  division: "",
  branch: "",
  requestedCompletionDate: "",
  assignedToPM: false,
  estimatedCosts: [],
};

const CreateProjectPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (newProjectData: Project) => {
    try {
      (newProjectData as any).locationId = newProjectData?.location?.id;
      (newProjectData as any).assignedTo = newProjectData?.assignedTo?.id;

      const payload = cleanObject(newProjectData);

      const response = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.apiToken}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const firstError = errorData?.errors?.[0]?.message || "Unknown error";
        alert(firstError);
        throw new Error(firstError);
      }

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
