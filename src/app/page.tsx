"use client";
import TaskTable from "./components/tasktable";
import TaskForm from "./components/taskform";
import { useTasksQuery } from "./hooks/usetask";
import { api } from "./lib/api";
import type { Task } from "./types";
import { QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useTasksQuery({
    includeSubtasks: true,
    limit: 100,
  });

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Task> | undefined>(undefined);
  const [parents, setParents] = useState<{ id: number; title: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const qc = useQueryClient();


  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const u = await api.getUsers();
        if (isMounted)
          setUsers(
            u.map((x) => ({ id: x.id, name: x.firstname + " " + x.lastname }))
          );
      } catch (e) {
        console.error(e);
      }

      try {
        const r = await api.getTasks("include=subtasks&page=1&limit=100");
        if (isMounted) {
          const ps = r.data.map((t: Task) => ({ id: t.id, title: t.title }));
          setParents(ps);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const createMutation = useMutation<Task, Error, Partial<Task>>({
    mutationFn: (payload) => api.createTask(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation<Task, Error, { id: number; payload: Partial<Task> }>({
    mutationFn: ({ id, payload }) => api.updateTask(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => api.deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleCreate = async (payload: Partial<Task>) => {
    await createMutation.mutateAsync(payload);
  };

  const handleEdit = (task: Task) => {
    setEditing(task);
    setOpenForm(true);
  };

  const handleUpdate = async (payload: Partial<Task>) => {
    if (!editing?.id) return;
    await updateMutation.mutateAsync({ id: editing.id, payload });
    setEditing(undefined);
  };

  const handleDelete = async (task: Task) => {
    await deleteMutation.mutateAsync(task.id);
  };

  const handleCreateSubtask = (parent: Task) => {
    setEditing({ parentId: parent.id });
    setOpenForm(true);
  };

  if (isLoading) {
    return (
      <Container
        sx={{
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading tasks...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEditing(undefined);
            setOpenForm(true);
          }}
        >
          Create task
        </Button>
      </Box>

      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateSubtask={handleCreateSubtask}
      />

      <TaskForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditing(undefined);
        }}
        onSave={async (payload) => {
          if (editing?.id) {
            await handleUpdate(payload);
          } else {
            await handleCreate({ ...payload });
          }
        }}
        initial={editing}
        users={users}
        parents={parents}
      />
    </Container>
  );
}
