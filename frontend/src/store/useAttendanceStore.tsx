import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { AttendanceState } from './types'



const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendance: [],
  loading: false,
  error: null,
  success: null,


   //FETCH BY DATE
  fetchByDate: async (date) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/attendance?date=${date}`);
      set({
        attendance: [...res.data], 
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Fetch failed",
      });
    }
  },



  // CHECK IN
  checkIn: async (data) => {
    set({ loading: true, error: null, success: null });

    try {
      await axiosInstance.post("/attendance/check-in", data);

      const today = new Date().toISOString().split("T")[0];
      await get().fetchByDate(today);

      set({
        loading: false,
        success: "Checked in successfully",
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Check-in failed",
      });
    }
  },


  
  // CHECK OUT
  checkOut: async (data) => {
    set({ loading: true, error: null, success: null });

    try {
      await axiosInstance.post("/attendance/check-out", data);

      const today = new Date().toISOString().split("T")[0];
      await get().fetchByDate(today);

      set({
        loading: false,
        success: "Checked out successfully",
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Check-out failed",
      });
    }
  },

}));

export default useAttendanceStore;