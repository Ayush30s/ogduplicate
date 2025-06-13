import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:7000", {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

export const SocketContext = createContext(socket);
