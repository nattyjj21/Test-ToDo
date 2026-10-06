import { Task } from "@prisma/client";

export type FilterStatus = "all" | "active" | "completed";

export type TaskWithDates = Omit<Task, "dueDate" | "createdAt" | "updatedAt"> & {
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};
