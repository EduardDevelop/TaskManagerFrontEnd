import type { Task } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ;
export const api = {
  getTasks: async (query: string): Promise<{ data: Task[] }> => {
    const res = await fetch(`${API_URL}/api/tasks?${query}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  createTask: async (payload: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  },

  updateTask: async (id: number, payload: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  },

  deleteTask: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
  },

  getUsers: async (): Promise<{ id: number; firstname: string; lastname: string }[]> => {
    const res = await fetch(`${API_URL}/api/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },
};
