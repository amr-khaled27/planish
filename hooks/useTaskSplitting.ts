import { useState } from "react";
import Task from "@/types/task";

interface PendingSubtaskState {
  subtasks: Task[];
  status: "pending" | "accepted" | "rejected";
}

export function useTaskSplitting() {
  const [splittingTaskId, setSplittingTaskId] = useState<string | null>(null);
  const [splitResults, setSplitResults] = useState<{
    [taskId: string]: Task[];
  }>({});
  const [pendingSubtasks, setPendingSubtasks] = useState<{
    [taskId: string]: PendingSubtaskState;
  }>({});
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  const splitTask = async (task: Task, allActiveTasks: Task[]) => {
    if (splittingTaskId) return;

    setSplittingTaskId(task.id);

    try {
      const response = await fetch("/api/split-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: task,
          currentOtherActiveTasks: allActiveTasks.filter(
            (t) => t.id !== task.id
          ),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPendingSubtasks((prev) => ({
          ...prev,
          [task.id]: {
            subtasks: result.subtasks,
            status: "pending",
          },
        }));

        setSplitResults((prev) => ({
          ...prev,
          [task.id]: result.subtasks,
        }));
      } else {
        console.error("Failed to split task:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error splitting task:", error);
      throw error;
    } finally {
      setSplittingTaskId(null);
    }
  };

  const acceptSubtasks = async (
    taskId: string,
    addNewTask: (taskData: any) => Promise<Task>
  ) => {
    const pending = pendingSubtasks[taskId];
    if (!pending || pending.status !== "pending") return;

    try {
      for (const subtask of pending.subtasks) {
        const { uid, id, createdAt, updatedAt, ...subtaskData } = subtask;
        await addNewTask(subtaskData);
      }

      setPendingSubtasks((prev) => ({
        ...prev,
        [taskId]: { ...pending, status: "accepted" },
      }));
    } catch (error) {
      console.error("Error accepting subtasks:", error);
      throw error;
    }
  };

  const rejectSubtasks = (taskId: string) => {
    const pending = pendingSubtasks[taskId];
    if (!pending || pending.status !== "pending") return;

    setPendingSubtasks((prev) => ({
      ...prev,
      [taskId]: { ...pending, status: "rejected" },
    }));

    setSplitResults((prev) => {
      const { [taskId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const editSubtask = (subtaskId: string, currentTitle: string) => {
    setEditingSubtask(subtaskId);
    setEditingTitle(currentTitle);
  };

  const saveSubtaskEdit = (taskId: string, subtaskId: string) => {
    if (!editingTitle.trim()) return;

    setPendingSubtasks((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        subtasks: prev[taskId].subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, title: editingTitle.trim() }
            : subtask
        ),
      },
    }));

    setSplitResults((prev) => ({
      ...prev,
      [taskId]: prev[taskId].map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, title: editingTitle.trim() }
          : subtask
      ),
    }));

    setEditingSubtask(null);
    setEditingTitle("");
  };

  const cancelEdit = () => {
    setEditingSubtask(null);
    setEditingTitle("");
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setPendingSubtasks((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        subtasks: prev[taskId].subtasks.filter(
          (subtask) => subtask.id !== subtaskId
        ),
      },
    }));

    setSplitResults((prev) => ({
      ...prev,
      [taskId]: prev[taskId].filter((subtask) => subtask.id !== subtaskId),
    }));
  };

  return {
    splittingTaskId,
    splitResults,
    pendingSubtasks,
    editingSubtask,
    editingTitle,
    setEditingTitle,

    splitTask,
    acceptSubtasks,
    rejectSubtasks,
    editSubtask,
    saveSubtaskEdit,
    cancelEdit,
    deleteSubtask,
  };
}
