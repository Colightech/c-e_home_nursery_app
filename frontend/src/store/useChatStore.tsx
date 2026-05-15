
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../socket/socket";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { Platform } from "react-native";

let latestSearch = "";
const QUEUE_KEY = "CHAT_OFFLINE_QUEUE";

const useChatStore = create<any>()(
  persist(
    (set, get) => ({
        messages: [],
        queue: [],
        chatUsers: [],
        searchResults: [],
        isFlushing: false,




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



        uploadMedia: async ( file: any,
            onProgress?: (percent: number) => void) => {

            return new Promise((resolve) => {
                try {
                    
                const formData = new FormData();
                formData.append("file", {
                    uri: file.uri,
                    name:
                    file.fileName ||
                    file.name ||
                    "media",

                    type:
                    file.type ||
                    "application/octet-stream",
                } as any);

                const xhr = new XMLHttpRequest();

                xhr.open(
                    "POST",
                    "https://joanna-nonpredicative-oversourly.ngrok-free.dev/api/chat/upload"
                );
                xhr.withCredentials = true;
                xhr.setRequestHeader(
                    "Content-Type",
                    "multipart/form-data"
                );

                let lastPercent = 0;
                xhr.upload.onprogress = (event) => {
                    if (!event.lengthComputable) return;
                    // raw percent
                    let percent = Math.floor(
                    (event.loaded / event.total) * 100
                    );
                    // HARD CLAMP (fixes 199% bug)
                    percent = Math.min(100, Math.max(0, percent));
                    // prevent backward jumps or spikes
                    if (percent < lastPercent) return;
                    lastPercent = percent;
                    onProgress?.(percent);
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        console.log("PARSE ERROR:", xhr.responseText);
                        resolve(null);
                    }
                    } else {
                    console.log("UPLOAD FAILED:", xhr.responseText);
                    resolve(null);
                    }
                };
                xhr.onerror = () => {
                    console.log("XHR NETWORK ERROR");
                    resolve(null);
                };
                xhr.send(formData);
                } catch (error) {
                console.log("UPLOAD ERROR:", error);
                resolve(null);
                }
            });
        },



        addToQueue: async (msg: any) => {
            const state = get();
            const updatedQueue = [...state.queue, msg];

            set({ queue: updatedQueue });

            try {
                await AsyncStorage.setItem(
                    QUEUE_KEY,
                    JSON.stringify(updatedQueue)
                );
            } catch (e) {
                console.log("QUEUE SAVE ERROR:", e);
            }
        },



        flushQueue: async () => {
            if (get().isFlushing) return;

            set({ isFlushing: true });

            try {
                const queue = get().queue;

                for (let msg of queue) {
                    await axiosInstance.post("/chat/send-message", msg);
                }

                set({ queue: [] });

                await AsyncStorage.removeItem(QUEUE_KEY);
            } catch (e) {
                console.log("FLUSH ERROR:", e);
            } finally {
                set({ isFlushing: false });
            }
        },



        restoreQueue: async () => {
            try {
                const stored = await AsyncStorage.getItem(QUEUE_KEY);

                if (!stored) return;

                const parsed = JSON.parse(stored);

                set({ queue: parsed || [] });
            } catch (e) {
                console.log("QUEUE RESTORE ERROR:", e);
            }
        },

    }),

    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);



export default useChatStore;