import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import type { AdminState } from "./types"; 
import axios from "axios";

const useAdminStore = create<AdminState>()((set) => ({
  stats: {
    users: 0,
    students: 0,
    teachers: 0,
    revenue: 0,
  },

  loading: false,
  error : null,

  fetchStats: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/admin/stats");

      set({
        stats: res.data.data,
        loading: false,
      });
    } catch (error) {
        const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "ADMIN STATS ERROR" ;
        set({ error: message, loading: false });
    }
  },
}));

export default useAdminStore;