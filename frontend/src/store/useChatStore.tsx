
import { create } from "zustand";
import socket from "../socket/socket";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { Platform } from "react-native";

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


    
   

    // sendMessage: async (payload: any) => {
    //     set({ loading: true, error: null });

    //     try {

    //         const res = await axiosInstance.post("/chat/send-message",
    //             {
    //                 ...payload,
    //                 media: payload.media
    //                     ? JSON.stringify(payload.media)
    //                     : null,
    //             }
    //         );

    //         console.log("SEND MESSAGE RESPONSE IN STORE:", res.data);

    //         const newMessage = res.data?.message;

    //         if (!newMessage) {
    //             throw new Error("No message returned");
    //         }

    //         set((state: any) => ({
    //             messages: state.messages.map((msg: any) =>
    //                 msg._id === payload.tempId
    //                     ? newMessage
    //                     : msg
    //             ),
    //         }));

    //         socket.emit("send_message", newMessage);

    //         return res.data;

    //     } catch (error: any) {
    //         console.log("SEND MESSAGE ERROR:", error?.response?.data || error.message);
    //         set((state: any) => ({
    //             messages: state.messages.map((msg: any) =>
    //                 msg._id === payload.tempId
    //                     ? { ...msg, status: "failed" }
    //                     : msg
    //             ),
    //         }));

    //         return null;
    //     }
    // },



    sendMessage: async (payload: any) => {
        set({ loading: true, error: null });

        try {
            const res = await axiosInstance.post("/chat/send-message", payload);

            console.log("SEND MESSAGE RESPONSE IN STORE:", res.data);

            const newMessage = res.data?.message;

            if (!newMessage) throw new Error("No message returned");

            set((state: any) => ({
                messages: state.messages.map((msg: any) =>
                    msg._id === payload.tempId ? newMessage : msg
                ),
                loading: false,
            }));

            socket.emit("send_message", newMessage);

            return res.data; // return full response
        } catch (error: any) {
            set({ loading: false });

            set((state: any) => ({
                messages: state.messages.map((msg: any) =>
                    msg._id === payload.tempId
                        ? { ...msg, status: "failed" }
                        : msg
                ),
            }));

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




    uploadMedia: async (file: any,
        onProgress?: (percent: number) => void) => {

        const formData = new FormData();

        formData.append("file", {
            uri: file.uri,
            name: file.fileName || file.name || "media",
            type: file.type || "application/octet-stream",
        } as any);

        try {

            const res = await axiosInstance.post("/chat/upload", formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },

                timeout: 600000,

                onUploadProgress: (e) => {

                    if (!e.total) return;

                    const percent = Math.floor(
                        (e.loaded * 100) / e.total
                    );

                    onProgress?.(percent);
                },
            });

            return res.data;

        } catch (error) {
            console.log("UPLOAD MEDIA ERROR:", error);
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