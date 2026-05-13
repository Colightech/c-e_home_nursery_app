
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
         set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post( "/chat/send-message",
                {
                    ...payload,
                    media: payload.media || null, // ensure consistency
                }
            );

            const newMessage = res.data?.message;

            if (!newMessage) {
                throw new Error("No message returned from server");
            }

            // instant UI update
            set((state: any) => ({
                messages: [...state.messages, newMessage],
                error: null,
            }));

            // realtime socket emit
            socket.emit("send_message", newMessage);

            return res.data;

        } catch (error: any) {
            console.log( "SEND MESSAGE ERROR:", error?.response?.data || error.message || error);

            set({ error: error?.response?.data?.message || "Failed to send message"});

            return null;
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



    // uploadMedia: async (file: any) => {
    //     set({ loading: true, error: null });

    //     try {

    //         const formData = new FormData();

    //         formData.append("file", {
    //             uri: file.uri,
    //             name: file.name || "media",
    //             type: file.type,
    //         } as any);

    //         const res = await axiosInstance.post("/chat/upload", formData, {
    //             headers: {
    //             "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         set({ loading: false });

    //         return res.data;

    //     } catch (error) {
    //         const message = axios.isAxiosError(error)
    //             ? error.response?.data?.message || error.message
    //             : "Upload failed";

    //         set({ loading: false, error: message });
    //         return null;
    //     }
    // },



    uploadMedia: async ( file: any,
        onProgress?: (percent: number) => void) => {

        const formData = new FormData();

        formData.append("file", {
            uri: file.uri,
            name: file.fileName || file.name || "media",
            type: file.type,
        } as any);

        try {

            const res = await axiosInstance.post("/chat/upload-media", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },

                onUploadProgress: (progressEvent) => {

                    if (!progressEvent.total) return;

                    const percent = Math.floor(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    if (onProgress) {
                        onProgress(percent);
                    }
                },
            });

            return res.data;

        } catch (error) {
            console.log("UPLOAD MEDIA ERROR:",error);
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