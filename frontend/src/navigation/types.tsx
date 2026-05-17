

export type RootStackParamList = {
  login: undefined;
  supperadmin: undefined;
  admin: undefined;
  caregiver: undefined;
  parent: undefined;

   //SUPPER ADMIN NAVIGATION
  supperAdminSetting: undefined;
  adduser: undefined;
  chatlistscreen: undefined;
  adminchildren: undefined;
  supperattendance: undefined;
  supperAdminHome: undefined;
  ChatListScreen: undefined;
  chatroom: {
     conversationId?: string | null;
    receiverId: string;
    receiverName: string;
  };

  //PARENT NAVIGATION
  parentsetting: undefined;
  parentchatlist: undefined;
  ParentHome: undefined;
  parentattendance: undefined;
  parentchatscreen: {
    conversationId?: string | null;
    receiverId: string;
    receiverName: string;
  };

};



