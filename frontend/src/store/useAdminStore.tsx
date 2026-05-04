import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import type { AdminState } from "./types"; 
import axios from "axios";



const useAdminStore = create<AdminState>()((set) => ({
  stats: {
    users: 0,
    children: 0,
    caregiver: 0,
    revenue: 0,
  },
  childdata: [],
  daycare: [],
  loading: false,
  error : null,


  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/dashboard/stats");
       console.log("res response", res);
      const data = res.data.data;
      set({
        stats: {
          users: data.users,
          children: data.children,     // 👈 map correctly
          caregiver: data.caregivers,   // 👈 map correctly
          revenue: data.revenue,
        },
        loading: false,
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch stats";

      set({ error: message, loading: false });
    }
  },

  
  fetchChildren: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/dashboard/children");

      set({ childdata: res.data.data, loading: false });

    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch stats";

      set({ error: message, loading: false });
    }
  },


  fetchDaycare: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/daycare");

      set({ daycare: res.data.data, loading: false });

    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch stats";

      set({ error: message, loading: false });
    }
  },

}));

export default useAdminStore;