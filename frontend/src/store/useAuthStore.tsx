import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import type { AuthState } from "./types"; 



const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,


      // LOGIN
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.post("/auth/login", { email, password });
          set({ user: res.data, loading: false });
          return res.data;
        } catch (error) {
          const message = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : "Something went wrong";
          set({ error: message, loading: false });
          return { error: true, message };
        }
      },


      checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            const user = res.data.data;
            set((state) => {
                if (state.user !== user) {
                    return { user };
                }
                return state;
            });
            return user;
        } catch (err) {
            set({ user: null });
            return null;
        }
      },

      //LOGOUT
      logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (e) {}
            set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
