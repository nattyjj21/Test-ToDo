"use client";

import { useState } from "react";
import { TaskWithDates } from "@/types/task";
import { Check, Trash2, Edit3, Calendar, AlertTriangle, Save } from "lucide-react";

interface TaskItemProps {
  task: TaskWithDates;
  onUpdate: (updatedTask: TaskWithDates) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(task.priority as "LOW" | "MEDIUM" | "HIGH");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle complete
  const handleToggleComplete = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdate(data);
      }
    } catch (err) {
      console.error("Failed to toggle completion:", err);
    }
  };

  // Save edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdate(data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDelete(task.id);
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setIsDeleting(false);
    }
  };

  // Priority badge styling
  const priorityColors = {
    LOW: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    MEDIUM: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    HIGH: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  if (isEditing) {
    return (
      <li className="bg-white dark:bg-gray-800 rounded-2xl border border-indigo-200 dark:border-indigo-900 shadow-sm p-4 sm:p-5 transition">
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Description..."
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                className="w-full mt-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border transition shadow-sm hover:shadow-md ${
        task.completed
          ? "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 opacity-75"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox Button */}
        <button
          type="button"
          onClick={handleToggleComplete}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 border ${
            task.completed
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
              : "border-gray-300 dark:border-gray-600 hover:border-indigo-600 dark:hover:border-indigo-400 bg-transparent text-transparent"
          }`}
        >
          <Check className={`w-4 h-4 stroke-[3] ${task.completed ? "opacity-100" : "opacity-0"}`} />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={`font-medium text-sm sm:text-base leading-snug break-words ${
                task.completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {task.title}
            </h4>

            {/* Priority Tag */}
            <span
              className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                priorityColors[task.priority as "LOW" | "MEDIUM" | "HIGH"]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                task.completed
                  ? "line-through text-gray-400 dark:text-gray-600"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Due date and metadata info */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isOverdue ? "text-rose-600 dark:text-rose-400 font-semibold" : ""
                }`}
              >
                {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                Due {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {isOverdue && " (Overdue)"}
              </span>
            )}

            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 self-end sm:self-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          disabled={task.completed}
          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700/80 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Edit task"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-rose-400 disabled:opacity-40 transition"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
