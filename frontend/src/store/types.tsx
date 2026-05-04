
export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;

  login: (email: string, password: string) => Promise<any>;
  checkAuth: () => Promise<User>;
  logout: () => void;
  register: (data: any) => Promise<any>;
};


export type AdminStats = {
  users: number;
  children: number;
  caregiver: number;
  revenue: number;
};


export type Child = {
  _id: string;
  firstName: string;
  lastName: string;
  address?: string;
  homeLanguage?: string;
  dateOfBirth?: string;
  pickupPassword?: string;
  daycareId?: string;

  // 👇 Parent
  parentId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  // 👇 Emergency Contacts
  emergencyContacts?: {
    name?: string;
    phone?: string;
    address?: string;
    relationship?: string;
  }[];

  // 👇 Authorized Contacts
  authorizedContacts?: {
    name?: string;
    address?: string;
    relationship?: string;
    hasLegalContactRight?: boolean;
    details?: string;
  }[];

  // 👇 Medical Info
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

  // 👇 Doctor
  doctor?: {
    name?: string;
    address?: string;
    phone?: string;
  };
};

export type AdminState = {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
  childdata: Child[];
  daycare: Child[];

  fetchStats: () => Promise<void>;
  fetchChildren: () => Promise<void>;
  fetchDaycare: () => Promise<void>;
};


export type User = {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "caregiver" | "parent";
  profile?: string;
};


export type AttendanceState = {
  attendance: any[];
  loading: boolean;
  error: string | null;
  success: string | null;

  checkIn: (data: any) => Promise<void>;
  checkOut: (data: any) => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
};