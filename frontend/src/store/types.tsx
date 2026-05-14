// =========================
// USER
// =========================
export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "super-admin" | "admin" | "caregiver" | "parent";
  profilePicture?: string;
  daycareId?: string;
};


// =========================
// AUTH STATE
// =========================
export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;

  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  checkAuth: () => Promise<User | null>;
  logout: () => Promise<void>;
};


// =========================
// DAYCARE
// =========================
export type Daycare = {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
};


// =========================
// CHILD
// =========================
export type Child = {
  _id: string;
  firstName: string;
  lastName: string;
  address?: string;
  homeLanguage?: string;
  dateOfBirth?: string;
  pickupPassword?: string;
  daycareId?: string;

  // Parent
  parentId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  // Emergency Contacts
  emergencyContacts?: {
    name?: string;
    phone?: string;
    address?: string;
    relationship?: string;
  }[];

  // Authorized Contacts
  authorizedContacts?: {
    name?: string;
    address?: string;
    relationship?: string;
    hasLegalContactRight?: boolean;
    details?: string;
  }[];

  // Medical Info
  medicalInfo?: {
    allergies?: {
      hasAllergies?: boolean;
      details?: string;
    };
    medicalConditions?: {
      hasCondition?: boolean;
      details?: string;
    };
    vaccinationsUpToDate?: boolean;
    vaccinationDetails?: string;
  };

  // Doctor
  doctor?: {
    name?: string;
    address?: string;
    phone?: string;
  };
};


// =========================
// ADMIN STATS
// =========================
export type AdminStats = {
  users: number;
  children: number;
  caregiver: number;
  revenue: number;
};


// =========================
// ADMIN STATE
// =========================
export type AdminState = {
  stats: AdminStats;
  loading: boolean;
  error: string | null;

  childdata: Child[];
  daycare: Daycare[];


  fetchStats: () => Promise<void>;
  fetchChildren: () => Promise<void>;
  fetchDaycare: () => Promise<void>;
};


// =========================
// ATTENDANCE
// =========================
export type Attendance = {
  _id: string;
  childId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  daycareId: string;

  status: "present" | "absent" | "late";

  timeIn?: string;
  timeOut?: string;

  checkedInBy?: {
    name: string;
    relationship: string;
  };

  checkedOutBy?: {
    name: string;
    relationship: string;
  };

  createdAt: string;
};


export type AttendanceState = {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  success: string | null;

  checkIn: (data: any) => Promise<void>;
  checkOut: (data: any) => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
};


// =========================
// CHAT MESSAGE
// =========================
export type Message = {
  _id: string;
  conversationId: string;

  sender: {
    _id: string;
    firstName?: string;
    lastName?: string;
  } | string;

  messageType: "text" | "image" | "file" | "video" | "document" | "contact";

  text?: string;


  media?: {
    url: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
  };

  contact?: {
    name: string;
    phone: string;
  };

  status?: "sent" | "delivered" | "read" | "uploading"  | "processing" | "failed";

  progress?: number;

  tempId?: string;

  createdAt: string;
};


// =========================
// CHAT STATE
// =========================
export type ChatState = {
  messages: Message[];
  queue: Message[];
  chatUsers: Message[],
  searchResults: Message[],

  sendMessage: (payload: any) => Promise<void>;
  addToQueue: (msg: Message) => void;
  flushQueue: () => Promise<void>;
  getChatUsers: () => Promise<void>;
  searchUsers: (search: string) => Promise<void>;
  uploadMedia: (file: any) => Promise<void>;
};