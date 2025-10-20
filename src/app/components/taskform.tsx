// src/components/TaskForm.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import type { Task, TaskStatus } from "../types";
import { api } from "../lib/api";

const STATUS_OPTIONS = ["TO_DO", "IN_PROGRESS", "COMPLETED"] as const;

export default function TaskForm({
  open,
  onClose,
  onSave,
  initial,
  users,
  parents,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Task>) => Promise<void>;
  initial?: Partial<Task>;
  users: { id: number; name: string }[];
  parents?: { id: number; title: string }[];
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState(initial?.status ?? "TO_DO");
  const [assigneeId, setAssigneeId] = useState<number | null | "">(
    initial?.assigneeId ?? ""
  );
  const [parentId, setParentId] = useState<number | null | "">(initial?.parentId ?? "");

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? "TO_DO");
    setAssigneeId(initial?.assigneeId ?? "");
    setParentId(initial?.parentId ?? "");
  }, [initial, open]);

  const handleSubmit = async () => {
    if (!title || title.trim().length < 3) return alert("Title min 3 chars");
    const payload: Partial<Task> = {
      title: title.trim(),
      description: description || null,
      status: status as Task["status"],
      assigneeId: assigneeId === "" ? null : (assigneeId as number),
      parentId: parentId === "" ? null : (parentId as number),
    };
    await onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.id ? "Edit task" : "Create task"}</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField label="Description" value={description ?? ""} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
        <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Assignee" value={assigneeId ?? ""} onChange={(e) => setAssigneeId(e.target.value === "" ? "" : Number(e.target.value))}>
          <MenuItem value="">Unassigned</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Parent (optional)" value={parentId ?? ""} onChange={(e) => setParentId(e.target.value === "" ? "" : Number(e.target.value))}>
          <MenuItem value="">No parent</MenuItem>
          {parents?.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initial?.id ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
