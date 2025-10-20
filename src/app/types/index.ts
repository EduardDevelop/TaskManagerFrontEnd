

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  assigneeId?: number | null;
  user?: User | null;
  assigneeName?: string | null;

  parentId?: number | null;
  createdAt?: string;
  updatedAt?: string;

  children?: Task[];

  progress?: {
    completed: number;
    total: number;
    percent: number;
  };
}
