"use client";
import { useTasks } from "@/context/TasksContext";
import { useModal } from "@/context/ModalContext";
import { useSearch } from "../layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sparkles, Brain, Zap } from "lucide-react";
import Task from "@/types/task";
import { useTaskSplitting } from "@/hooks/useTaskSplitting";
import { AIStatsCard } from "@/components/ai/AIStatsCard";
import { TaskWithSplit } from "@/components/ai/TaskWithSplit";
import { EmptyState } from "@/components/ai/EmptyState";

export default function AIPlannerPage() {
  const { tasks, isLoading, addNewTask, updateExistingTask, removeTask } =
    useTasks();
  const { openEditModal } = useModal();
  const { searchTerm } = useSearch();

  const {
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
  } = useTaskSplitting();

  const allActiveTasks = tasks.filter((task) => task.status !== "done");
  const activeTasks = allActiveTasks.filter(
    (task) =>
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSplitTask = async (task: Task) => {
    try {
      await splitTask(task, allActiveTasks);
    } catch (error) {
      console.error("Failed to split task:", error);
    }
  };

  const handleAcceptSubtasks = async (taskId: string) => {
    try {
      await acceptSubtasks(taskId, addNewTask);
    } catch (err) {
      console.error("Error accepting subtasks:", err);
    }
  };

  const handleEditTask = (task: Task) => {
    openEditModal(task.id);
  };

  const handleDeleteTask = async (taskId: string) => {
    await removeTask(taskId);
  };

  const toggleTaskStatus = async (taskId: string, isDone: boolean) => {
    await updateExistingTask(taskId, {
      status: isDone ? "done" : "todo",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-white">AI Task Planner</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Break down your complex tasks into manageable steps with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AIStatsCard
          icon={Zap}
          iconColor="text-blue-400"
          label={searchTerm ? "Filtered Tasks" : "Active Tasks"}
          value={activeTasks.length}
          subValue={searchTerm ? allActiveTasks.length : undefined}
          subLabel={searchTerm ? "of" : undefined}
        />

        <AIStatsCard
          icon={Sparkles}
          iconColor="text-purple-400"
          label="Tasks Split"
          value={Object.keys(splitResults).length}
        />

        <AIStatsCard
          icon={Brain}
          iconColor="text-green-400"
          label="Subtasks Created"
          value={Object.values(splitResults).reduce(
            (sum, subtasks) => sum + subtasks.length,
            0
          )}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap className="text-blue-400" size={20} />
            Your Active Tasks
          </h2>
          {searchTerm && (
            <p className="text-sm text-gray-400">
              Showing {activeTasks.length} of {allActiveTasks.length} tasks
              matching {searchTerm}
            </p>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <EmptyState hasSearchTerm={!!searchTerm} searchTerm={searchTerm} />
        ) : (
          <div className="grid gap-4">
            {activeTasks.map((task, idx) => (
              <TaskWithSplit
                key={task.id}
                task={task}
                index={idx}
                isBeingSplit={splittingTaskId === task.id}
                pendingSubtasks={pendingSubtasks[task.id]?.subtasks}
                pendingStatus={pendingSubtasks[task.id]?.status}
                splitResults={splitResults[task.id]}
                editingSubtask={editingSubtask}
                editingTitle={editingTitle}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleDone={toggleTaskStatus}
                onSplit={handleSplitTask}
                onAcceptSubtasks={handleAcceptSubtasks}
                onRejectSubtasks={rejectSubtasks}
                onEditSubtask={editSubtask}
                onSaveSubtaskEdit={saveSubtaskEdit}
                onCancelEdit={cancelEdit}
                onDeleteSubtask={deleteSubtask}
                onTitleChange={setEditingTitle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
