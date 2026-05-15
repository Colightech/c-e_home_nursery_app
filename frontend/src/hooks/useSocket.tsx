
import { useEffect } from "react";
import socket from "../socket/socket";
import useChatStore from "../store/useChatStore";

const useSocket = (userId: string) => {

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.emit("addUser", userId);

    socket.on("connect", () => {
      useChatStore.getState().flushQueue();
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [userId]);
};

export default useSocket;