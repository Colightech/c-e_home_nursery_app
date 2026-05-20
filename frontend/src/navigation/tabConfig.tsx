
import SupperAdminScreen from "../screens/supperadmin/SupperAdminScreen";
import ChatListScreen from "../screens/supperadmin/ChatListScreen";
import AdminChildren from "../screens/supperadmin/AdminChildren";
import SupperAdminAttendance from "../screens/supperadmin/SupperAdminAttendance";

import ParentScreen from "../screens/parent/ParentScreen"
import ParentChatListScreen from "../screens/parent/ParentChatListScreen"
import ParentAttendance from "../screens/parent/ParentAttendance"

import type { TabItem, UserRole } from "./types";
import SupperAdminPayment from "../screens/supperadmin/SupperAdminPayment";
import ParentPayment from "../screens/parent/ParentPayment";


export const tabConfig: Record<UserRole, TabItem[]> = {

  "super-admin": [
    { name: "Home", component: SupperAdminScreen, icon: "home-outline"},
    { name: "Chats", component: ChatListScreen, icon: "chatbubble-outline"},
    { name: "Children", component: AdminChildren, icon: "people-outline"},
    { name: "Payment", component: SupperAdminPayment, icon: "wallet-outline"},
    { name: "Attendance", component: SupperAdminAttendance, icon: "school-outline"},
  ],

  admin: [
    // admin tabs here
  ],

  caregiver: [
    // caregiver tabs here
  ],

  "parent": [
    { name: "Home", component: ParentScreen, icon: "home-outline"},
    { name: "Chats", component: ParentChatListScreen, icon: "chatbubble-outline"},
    { name: "Payment", component: ParentPayment, icon: "wallet-outline"},
    { name: "Attendance", component: ParentAttendance, icon: "school-outline"},
  ],
};
