import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("https://gymbackenddddd-1.onrender.com/", {
  withCredentials: true,
});

export const SocketContext = createContext(socket);
