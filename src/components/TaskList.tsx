"use client";

import { TaskWithDates } from "@/types/task";
import { TaskItem } from "./TaskItem";
import { Inbox } from "lucide-react";

interface TaskListProps {
  tasks: TaskWithDates[];
  onUpdate: (updatedTask: TaskWithDates) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/60">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          No tasks found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          You don&apos;t have any tasks in this view. Create a new task to get started or switch your filter!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
