// src/lib/socket.ts
import io from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

let socket: SocketInstance | null = null;

export function initSocket() {
  if (socket) return socket;
  socket = io("https://taskmanagerbackend-7ase.onrender.com", {
    transports: ["websocket"],
  });s
  return socket;
}

export function getSocket() {
  if (!socket) initSocket();
  return socket!;
}
