

import { create } from "zustand";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

type PaymentStore = {
    payments: any[];
    loading: boolean;
    error: null;
  

  getAllPayments: () => Promise<void>;
  createPayment: (data: any) => Promise<any>;
  confirmAdminPayment: (paymentId: string) => Promise<void>;
  ParentConfirmPayment: (paymentId: string) => Promise<void>;
  getParentPayment: () => Promise<void>;
};

const usePaymentStore = create<PaymentStore>((set, get) => ({

    payments: [],
    loading: false,
    error: null,

    // GET ALL PAYMENTS
    getAllPayments: async () => {
      try {

        set({ loading: true });

        const res = await axiosInstance.get("/payments/all-payment");

        set({ payments: res.data.payments, loading: false});

      } catch (error) {
        console.log("GET PAYMENTS ERROR:",error);
      } finally {
        set({ loading: false });
      }
    },



     getParentPayment: async () => {
      try {

        set({ loading: true });

        const res = await axiosInstance.get("/payments/parent");

        set({ payments: res.data.payments, loading: false});

      } catch (error) {
        console.log("GET PAYMENTS ERROR:",error);
      } finally {
        set({ loading: false });
      }
    },



    // CREATE PAYMENT
    createPayment: async (data) => {
        set({ loading: true });
      try {

        const res = await axiosInstance.post("/payments/create", data);

        set((state) => ({
          payments: [
            res.data.payment,
            ...state.payments,
          ],
        }));

        return res.data;

      } catch (error) {
        console.log("CREATE PAYMENT ERROR:",error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ||
            error.message
          : "Something went wrong";

        set({ error: message });
      } finally {
        set({ loading: false });
      }
    },



    // ADMIN CONFIRM PAYMENT
    confirmAdminPayment: async ( paymentId ) => {
      try {

        await axiosInstance.post(`/payments/admin-confirm/${paymentId}`);

        set((state) => ({payments: state.payments.map(
            (payment: any) => payment._id === paymentId
                ? {
                    ...payment,
                    status: "paid",
                  }
                : payment
          ),
        }));

      } catch (error) {
        console.log("CONFIRM PAYMENT ERROR:",error);
      }
    },



    ParentConfirmPayment: async (paymentId) => {
      try {

        await axiosInstance.post(`/payments/parent-confirm/${paymentId}`);
        set((state) => ({payments: state.payments.map(
            (payment: any) => payment._id === paymentId
                ? {
                    ...payment,
                    status: "awaiting_admin",
                  }
                : payment
          ),
        }));

      } catch (error) {
        console.log("CONFIRM PAYMENT ERROR:",error);
      }
    },

  })
);

export default usePaymentStore;