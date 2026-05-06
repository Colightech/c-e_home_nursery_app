
import { io } from "socket.io-client";

const socket = io("https://joanna-nonpredicative-oversourly.ngrok-free.dev", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;