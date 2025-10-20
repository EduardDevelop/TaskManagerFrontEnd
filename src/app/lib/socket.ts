// src/lib/socket.ts
import io from "socket.io-client";

type SocketInstance = ReturnType<typeof io>;

let socket: SocketInstance | null = null;

export function initSocket() {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_API_WS ?? "http://localhost:3000", {
    transports: ["websocket"],
  });
  return socket;
}

export function getSocket() {
  if (!socket) initSocket();
  return socket!;
}
