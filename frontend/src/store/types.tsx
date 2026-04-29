
export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<any>;
  checkAuth: () => Promise<User>;
  logout: () => void;
};


export type AdminStats = {
  users: number;
  students: number;
  teachers: number;
  revenue: number;
};

export type AdminState = {
  stats: AdminStats;
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
};


export type User = {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "caregiver" | "parent";
  profile?: string;
};