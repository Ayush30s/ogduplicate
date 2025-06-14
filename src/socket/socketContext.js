import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("https://gymbackenddddd-1.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

export const SocketContext = createContext(socket);
