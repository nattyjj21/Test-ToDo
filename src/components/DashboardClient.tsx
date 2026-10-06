"use client";

import { useState } from "react";
import { TaskWithDates, FilterStatus } from "@/types/task";
import { FilterBar } from "@/components/FilterBar";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { RefreshCw } from "lucide-react";

interface DashboardClientProps {
  initialTasks: TaskWithDates[];
  userName?: string | null;
}

export function DashboardClient({
  initialTasks,
  userName,
}: DashboardClientProps) {
  const [tasks, setTasks] = useState<TaskWithDates[]>(initialTasks);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh tasks from server
  const fetchTasks = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to refresh tasks:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleTaskUpdated = (updatedTask: TaskWithDates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleTaskDeleted = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter calculation
  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completionPercentage =
    counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome header & summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/20">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="mt-1 text-indigo-100 text-sm sm:text-base">
            You have{" "}
            <span className="font-semibold text-white underline decoration-indigo-300">
              {counts.active} active task{counts.active === 1 ? "" : "s"}
            </span>{" "}
            remaining today.
          </p>
        </div>

        {/* Quick progress indicator */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[160px]">
          <div className="flex items-center justify-between text-xs font-medium text-indigo-100 mb-1.5">
            <span>Progress</span>
            <span className="font-bold text-white">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-indigo-100/90 text-right">
            {counts.completed} of {counts.all} completed
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <div>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      {/* Filters and List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <FilterBar
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />

          <button
            onClick={fetchTasks}
            disabled={isRefreshing}
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition"
            title="Refresh tasks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onUpdate={handleTaskUpdated}
          onDelete={handleTaskDeleted}
        />
      </div>
    </div>
  );
}
