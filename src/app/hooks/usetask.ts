// src/hooks/useTasks.ts
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { initSocket, getSocket } from "../lib/socket";
import type { TaskStatus } from "../types";


export type TaskFilters = {
  status?: TaskStatus;
  assignee?: number;
};


interface UseTasksQueryParams {
  includeSubtasks?: boolean;
  page?: number;
  limit?: number;
  filters?: TaskFilters;
}

export function useTasksQuery({
  includeSubtasks = true,
  page = 1,
  limit = 50,
  filters = {},
}: UseTasksQueryParams = {}) {
  const params = new URLSearchParams();

  if (includeSubtasks) params.set("include", "subtasks");
  params.set("page", String(page));
  params.set("limit", String(limit));


  if (filters.status) params.set("status", filters.status);
  if (filters.assignee) params.set("assignee", String(filters.assignee));

  const queryKey = ["tasks", params.toString()];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.getTasks(params.toString());
      return res.data;
    },
    staleTime: 2000,
  });

  const qc = useQueryClient();
  initSocket();
  const socket = getSocket();

  if (socket) {
    socket.off("task:created");
    socket.off("task:updated");
    socket.off("task:deleted");

    socket.on("task:created", () => qc.invalidateQueries({ queryKey: ["tasks"] }));
    socket.on("task:updated", () => qc.invalidateQueries({ queryKey: ["tasks"] }));
    socket.on("task:deleted", () => qc.invalidateQueries({ queryKey: ["tasks"] }));
  }

  return { ...query, queryKey };
}
