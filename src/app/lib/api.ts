// src/lib/api.ts
import type { Task } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // Fail early in dev so no silent "fetch to undefined"
  console.error("NEXT_PUBLIC_API_URL is not defined. Set it in .env.local or in Vercel env vars.");
}

async function handleRes<T = any>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    (err as any).status = res.status;
    throw err;
  }
  // if no content
  if (res.status === 204) return null as unknown as T;
  return res.json() as Promise<T>;
}

export const api = {
  getTasks: async (query = ""): Promise<{ data: Task[] } | Task[]> => {
    if (!API_URL) throw new Error("API_URL not configured");
    const url = `${API_URL.replace(/\/$/, "")}/api/tasks?${query}`;
    const res = await fetch(url, {
      method: "GET",
      // credentials: "include", // habilitar solo si usas cookies/session
      headers: {
        "Accept": "application/json",
      },
    });
    return handleRes(res);
  },

  createTask: async (payload: Partial<Task>): Promise<Task> => {
    if (!API_URL) throw new Error("API_URL not configured");
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // credentials: "include",
    });
    return handleRes(res);
  },

  updateTask: async (id: number, payload: Partial<Task>): Promise<Task> => {
    if (!API_URL) throw new Error("API_URL not configured");
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // credentials: "include",
    });
    return handleRes(res);
  },

  deleteTask: async (id: number): Promise<void> => {
    if (!API_URL) throw new Error("API_URL not configured");
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/api/tasks/${id}`, {
      method: "DELETE",
      // credentials: "include",
    });
    return handleRes<void>(res);
  },

  getUsers: async (): Promise<{ id: number; firstname: string; lastname: string }[]> => {
    if (!API_URL) throw new Error("API_URL not configured");
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/api/users`, {
      method: "GET",
    });
    return handleRes(res);
  },
};
