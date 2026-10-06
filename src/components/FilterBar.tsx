"use client";

import { FilterStatus } from "@/types/task";
import { CheckCircle2, Circle, ListFilter } from "lucide-react";

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function FilterBar({
  currentFilter,
  onFilterChange,
  counts,
}: FilterBarProps) {
  const filters: { id: FilterStatus; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: "all",
      label: "All",
      icon: <ListFilter className="w-4 h-4" />,
      count: counts.all,
    },
    {
      id: "active",
      label: "Active",
      icon: <Circle className="w-4 h-4" />,
      count: counts.active,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CheckCircle2 className="w-4 h-4" />,
      count: counts.completed,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
