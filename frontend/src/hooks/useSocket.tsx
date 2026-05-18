
import { useEffect } from "react";
import socket from "../socket/socket";
import useChatStore from "../store/useChatStore";


// const useSocket = (userId: string) => {

//   useEffect(() => {
//     if (!userId) return;

//     socket.connect();

//     socket.emit("addUser", userId);

//     socket.on("connect", () => {
//       useChatStore.getState().flushQueue();
//     });

//     return () => {
//       socket.off("connect");
//       socket.disconnect();
//     };
//   }, [userId]);
// };

// export default useSocket;



const useSocket = (userId: string) => {
  useEffect(() => {
    if (!userId) return;

    // 1. Ensure socket is connected FIRST
    if (!socket.connected) {
      socket.connect();
    }

    // 2. Register connect listener BEFORE emitting
    const onConnect = () => {
      socket.emit("addUser", userId);
      useChatStore.getState().flushQueue();
    };

    socket.on("connect", onConnect);

    // 3. If already connected, emit immediately
    if (socket.connected) {
      socket.emit("addUser", userId);
      useChatStore.getState().flushQueue();
    }

    return () => {
      socket.off("connect", onConnect);
      // ❌ DO NOT disconnect here
    };
  }, [userId]);
};

export default useSocket;