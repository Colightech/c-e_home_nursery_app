
import { create } from "zustand";
import socket from "../socket/socket";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";

let latestSearch = "";

const useChatStore = create<any>((set, get) => ({
    messages: [],
    queue: [],
    chatUsers: [],
    searchResults: [],


    getChatUsers: async () => {
        set({ loading: true, error: null });
        try {
        const res = await axiosInstance.get("/chat/chat-users");
        set({ chatUsers: res.data });
        } catch (error) {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : "Failed to fetch users";

        set({ error: message, loading: false });
        }
    },



    searchUsers: async (search: string) => {

        latestSearch = search;
        set({ loading: true, error: null });

        try {

        const res = await axiosInstance.get(`/chat/search-users?search=${search}`);
        // ignore old requests
        if (!search.trim()) {
            set({ searchResults: [] });
            return;
        }
        set({ searchResults: res.data, loading: false });

        } catch (error) {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : "Failed to search users";

        set({ error: message, loading: false });
        }
    },


    getMessages: async (conversationId: string) => {
        set({ loading: true, error: null });

        try {

            const res = await axiosInstance.get(`/chat/${conversationId}`
            );
            set({
                messages: res.data,
                loading: false,
                });
            return res.data;

        } catch (err: any) {

            set({
            loading: false,
            error:
                err.response?.data?.message ||
                "Failed to fetch messages",
            });

            return [];
        }
    },


    
 
    sendMessage: async (payload: any) => {
        try {

            const res = await axiosInstance.post(
            "/chat/send-message",
            payload
            );

            // instant UI update
            set((state: any) => ({
                messages: [...state.messages, res.data.message]
            }));

            // realtime socket
            socket.emit("send_message", res.data.message);

            return res.data;

        } catch (err) {
            console.log(err);
        }
    },




    findConversation: async (receiverId: string) => {
        try {

            const res = await axiosInstance.post(
            "/chat/find-conversation",
            { receiverId }
            );

            return res.data;

        } catch (error) {
            console.log("findConversation error", error);
            return null;
        }
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