import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import ProgressBar from "./progressbar";
import type { Task } from "../types";

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onCreateSubtask,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onCreateSubtask: (parent: Task) => void;
}) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const confirmDelete = (task: Task) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(task);
        Swal.fire("Deleted!", "The task has been deleted.", "success");
      }
    });
  };

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        cell: (info) => {
          const row = info.row.original;
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {row.children && row.children.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() =>
                    setExpanded((s) => ({ ...s, [row.id]: !s[row.id] }))
                  }
                >
                  <ExpandMoreIcon
                    sx={{
                      transform: expanded[row.id] ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </IconButton>
              )}
              <Box>
                <Typography variant="subtitle2">{row.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.description}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: (info) => (
          <Typography>{info.row.original.status}</Typography>
        ),
      },
      {
        id: "assignee",
        header: "Assigned",
        cell: (info) => {
          const user = info.row.original.user;
          return (
            <Typography>
              {user
                ? `${user.firstname} ${user.lastname}`
                : "—"}
            </Typography>
          );
        },
      },
      {
        id: "progress",
        header: "Progress",
        cell: (info) => (
          <ProgressBar percent={info.row.original.progress?.percent ?? 0} />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          return (
            <>
              <IconButton size="small" onClick={() => onEdit(row)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => confirmDelete(row)}>
                <DeleteIcon />
              </IconButton>
              {row.parentId === null && (
                <IconButton size="small" onClick={() => onCreateSubtask(row)}>
                  <AddIcon />
                </IconButton>
              )}
            </>
          );
        },
      },
    ],
    [onEdit, onDelete, onCreateSubtask, expanded]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableCell key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {expanded[row.original.id] &&
                row.original.children &&
                row.original.children.map((child) => (
                  <TableRow
                    key={`child-${child.id}`}
                    sx={{ bgcolor: "#fafafa" }}
                  >
                    <TableCell sx={{ pl: 6 }}>
                      <Typography variant="body2">{child.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {child.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{child.status}</TableCell>
                    <TableCell>
                      {child.user
                        ? `${child.user.firstname} ${child.user.lastname}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <ProgressBar percent={child.progress?.percent ?? 0} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => onEdit(child)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => confirmDelete(child)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
