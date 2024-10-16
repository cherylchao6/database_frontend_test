export interface Solution {
  siteAlias: string;
  codecAlias: string;
  systemName: string;
  supportLevel: string;
  levelOfCourt: string;
  solutionType: string;
  solutionTypeIfOther: string;
  roomFunction: string;
  roomFunctionIfOther: string;
  secondaryRoomFunctions: string;
  features: { id: string; feature: string }[];
  systemCtrlType: string;
  audioConfePhoneNum: string;
  privacyNum: string;
  hasLocalConnec: boolean;
  localConnecRooms: { alias: string; roomNum: string }[];
}
