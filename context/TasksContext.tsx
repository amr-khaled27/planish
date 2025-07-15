"use client";
import { createContext, useContext, ReactNode } from "react";
import { useTasks as useTasksHook } from "../hooks/useTasks";
import Task from "@/types/task";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  fetchTasks: () => Promise<void>;
  loadMoreTasks: () => Promise<void>;
  addNewTask: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "uid">
  ) => Promise<Task>;
  updateExistingTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "uid">>,
    optimistic?: boolean
  ) => Promise<any>;
  removeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskHook = useTasksHook();

  return (
    <TaskContext.Provider value={taskHook}>{children}</TaskContext.Provider>
  );
}
