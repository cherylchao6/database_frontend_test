"use client";
import RoomSolutionForm from "@/components/RoomSolutionForm";
import { Room } from "@/types/intakes/room";
import { Solution } from "@/types/intakes/solution";

const initRoomData: Room = {
  ministry: "MAG",
  division: "Court Services",
  branchSiteName: "Brampton (A. Grenville and William Davis) Courthouse",
  city: "Brampton",
  streetAddress: "7755 Hurontario Street",
  floor: "",
  roomNumber: "",
  postalCode: "L6W 4T1",
  businessRegion: "",
  buildingType: "",
  hoursOfOperation: "",
};

const initSolutionData: Solution = {
  siteAlias: "",
  codecAlias: "",
  systemName: "",
  supportLevel: "",
  levelOfCourt: [],
  solutionType: "",
  solutionTypeIfOther: "",
  roomFunction: [],
  roomFunctionIfOther: "",
  secondaryRoomFunctions: "",
  features: [],
  systemCtrlType: "",
  audioConfePhoneNum: "",
  privacyNum: "",
  hasLocalConnec: false,
  localConnecRooms: [],
};

const CreateRoomPage = () => {
  const handleSave = (roomData: Room, solutionData: Solution) => {
    console.log("Created Room Data:", roomData);
    console.log("Created Solution Data:", solutionData);
  };

  return (
    <div>
      <RoomSolutionForm
        initialRoomData={initRoomData}
        initialSolutionData={initSolutionData}
        isEditMode={false}
        onSave={handleSave}
      />
    </div>
  );
};

export default CreateRoomPage;
