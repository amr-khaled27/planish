"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getAllTasks,
  getTasksPaginated,
  addTask,
  updateTask,
  deleteTask,
} from "@/actions/firebase";
import Task from "@/types/task";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setCurrentPage(0);
      const result = await getTasksPaginated(user.uid, 10, 0);
      setTasks(result.tasks);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadMoreTasks = useCallback(async () => {
    if (!user || !hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const result = await getTasksPaginated(user.uid, 10, nextPage);

      setTasks((currentTasks) => {
        const existingIds = new Set(currentTasks.map((task) => task.id));
        const newTasks = result.tasks.filter(
          (task) => !existingIds.has(task.id)
        );
        return [...currentTasks, ...newTasks];
      });

      setCurrentPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more tasks:", error);
      throw error;
    } finally {
      setIsLoadingMore(false);
    }
  }, [user, hasMore, isLoadingMore, currentPage]);

  const addNewTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "uid">) => {
      if (!user) throw new Error("User not authenticated");

      try {
        const newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
          ...taskData,
          uid: user.uid,
        };

        console.log("Adding new task:", newTaskData);
        const newTaskId = await addTask(user.uid, newTaskData);

        const now = new Date().toISOString();
        const completeTask: Task = {
          ...newTaskData,
          id: newTaskId,
          createdAt: now,
          updatedAt: now,
        };

        console.log("Complete task to add to state:", completeTask);
        setTasks((currentTasks) => {
          const newTasks = [...currentTasks, completeTask];
          console.log("Updated tasks array:", newTasks);
          return newTasks;
        });
        return completeTask;
      } catch (error) {
        console.error("Error adding task:", error);
        throw error;
      }
    },
    [user]
  );

  const updateExistingTask = useCallback(
    async (
      taskId: string,
      updates: Partial<Omit<Task, "id" | "createdAt" | "uid">>,
      optimistic: boolean = true
    ) => {
      if (!user) throw new Error("User not authenticated");

      const updatedTaskData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      if (optimistic) {
        // Store original task for rollback
        const originalTask = tasks.find((task) => task.id === taskId);
        if (!originalTask) throw new Error("Task not found");

        // Apply optimistic update immediately
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTaskData } : task
          )
        );

        try {
          // Attempt to update on server
          await updateTask(user.uid, taskId, updatedTaskData);
          return updatedTaskData;
        } catch (error) {
          console.error("Error updating task:", error);

          // Rollback optimistic update
          setTasks((currentTasks) =>
            currentTasks.map((task) =>
              task.id === taskId ? originalTask : task
            )
          );

          throw error;
        }
      } else {
        // Non-optimistic update (wait for server response first)
        try {
          await updateTask(user.uid, taskId, updatedTaskData);

          setTasks((currentTasks) =>
            currentTasks.map((task) =>
              task.id === taskId ? { ...task, ...updatedTaskData } : task
            )
          );

          return updatedTaskData;
        } catch (error) {
          console.error("Error updating task:", error);
          throw error;
        }
      }
    },
    [user, tasks]
  );

  const removeTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }, []);

  return {
    tasks,
    isLoading,
    isLoadingMore,
    hasMore,
    fetchTasks,
    loadMoreTasks,
    addNewTask,
    updateExistingTask,
    removeTask,
  };
}
