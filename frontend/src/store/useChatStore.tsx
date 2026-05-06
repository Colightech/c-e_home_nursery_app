
import { create } from "zustand";
import socket from "../socket/socket";
import axiosInstance from "../api/axiosInstance";

const useChatStore = create<any>((set, get) => ({
  messages: [],
  queue: [],


    getMessages: async (conversationId: string) => {
        set({ loading: true, error: null });

        try {
            const res = await axiosInstance.get(`/chat/${conversationId}`);

            set({
                messages: res.data,
                loading: false,
            });

            return res.data;
        } catch (err: any) {
            set({
                loading: false,
                error: err.response?.data?.message || "Failed to fetch messages",
            });

            return [];
        }
    },


    sendMessage: async (payload: any) => {
        const res = await axiosInstance.post("/chat/send-message", payload);

        await get().getMessages();
        set((state: any) => ({
            messages: [...state.messages, res.data],
        }));

        // realtime push
        socket.emit("send_message", res.data);
    },



    addToQueue: (msg: any) =>
        set((state: any) => ({
            queue: [...state.queue, msg],
        })),

        flushQueue: async () => {
        const queue = get().queue;

        for (let msg of queue) {
            await axiosInstance.post("/chat/send-message", msg);
        }
        set({ queue: [] });
    },

}));

export default useChatStore;