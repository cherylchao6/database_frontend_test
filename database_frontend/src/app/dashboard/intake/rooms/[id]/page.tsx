"use client";
import RoomSolutionForm from "@/components/RoomSolutionForm";
import { Room } from "@/types/intakes/room";
import { Solution } from "@/types/intakes/solution";

const fakeRoomData: Room = {
  ministry: "MAG",
  division: "Court Services",
  branchSiteName: "Brampton (A. Grenville and William Davis) Courthouse",
  city: "Brampton",
  streetAddress: "7755 Hurontario Street",
  floor: "4",
  roomNumber: "401",
  postalCode: "L6W 4T1",
  businessRegion: "East",
  buildingType: "Courthouse",
  hoursOfOperation: "Business Hours",
};

const fakeSolutionData: Solution = {
  siteAlias: "5200073",
  codecAlias: "5200073",
  systemName: "Brampton-7755-Hurontario-Ctrm-401",
  supportLevel: "Legacy Support",
  levelOfCourt: ["Superior Court of Justice"],
  solutionType: "Courtroom",
  solutionTypeIfOther: "",
  roomFunction: ["Trial Court"],
  roomFunctionIfOther: "",
  secondaryRoomFunctions: "",
  features: [
    { id: "1", feature: "Soft Codec Audio Only" },
    { id: "2", feature: "Audio Uplift" },
  ],
  systemCtrlType: "Crestron Touch panel",
  audioConfePhoneNum: "9054568011",
  privacyNum: "",
  hasLocalConnec: false,
  localConnecRooms: [],
};

// const fetchRoomData = async (id: string) => {
//   const response = await fetch(`${apiUrl}/intakes/rooms/${id}`);
//   return response.json();
// };

const RoomSolutionPage = () => {
  // const pathname = usePathname();
  // const id = pathname.split("/").pop();
  // Fetch project data based on the project ID from the URL
  // useEffect(() => {
  //   if (id) {
  //     fetchRoomData(id);
  //   }
  // }, [id]);

  const handleSave = (roomData: Room, solutionData: Solution) => {
    console.log("Created Room Data:", roomData);
    console.log("Created Solution Data:", solutionData);
  };

  return (
    <div>
      <RoomSolutionForm
        initialRoomData={fakeRoomData}
        initialSolutionData={fakeSolutionData}
        isEditMode={true}
        onSave={handleSave}
      />
    </div>
  );
};

export default RoomSolutionPage;
