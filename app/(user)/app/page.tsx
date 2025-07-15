"use client";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/context/TasksContext";
import { useModal } from "@/context/ModalContext";
import { Plus } from "lucide-react";
import Task from "@/types/task";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskCard } from "@/components/TaskCard";
import { useSearch } from "./layout";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const { user, loading } = useAuth();
  const { searchTerm } = useSearch();
  const {
    tasks,
    isLoading: isFetchingTasks,
    isLoadingMore,
    hasMore,
    loadMoreTasks,
    removeTask: deleteTask,
    updateExistingTask,
  } = useTasks();
  const { openAddModal, openEditModal } = useModal();

  const onAddTask = () => {
    openAddModal();
  };

  const onEditTask = (task: Task) => {
    openEditModal(task.id);
  };

  const onDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onToggleDone = async (taskId: string, isDone: boolean) => {
    try {
      await updateExistingTask(
        taskId,
        {
          status: (isDone ? "done" : "todo") as "done" | "todo",
        },
        true
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }, []);

  const visibleTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">
          Hey, {user?.displayName?.split(" ")[0]} — Good {greeting} 👋
        </h1>

        <div className="py-8">
          <motion.button
            onClick={onAddTask}
            className="bg-accent/80 mb-6 text-white px-4 py-2 rounded-full hover:bg-accent/50 transition-colors flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>

          {isFetchingTasks && (
            <div className="flex justify-center py-10">
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            </div>
          )}

          {!isFetchingTasks && !visibleTasks.length && !searchTerm && (
            <motion.div
              className="text-center py-10 text-gray-400 text-xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              No tasks yet. Create your first task to get started!
            </motion.div>
          )}

          {!isFetchingTasks && !visibleTasks.length && searchTerm && (
            <motion.div
              className="text-center py-10 text-gray-400 text-xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              No tasks matched your search.
            </motion.div>
          )}

          {!isFetchingTasks && visibleTasks.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="popLayout">
                {visibleTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onToggleDone={onToggleDone}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More Button */}
          {!isFetchingTasks && !searchTerm && hasMore && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={loadMoreTasks}
                disabled={isLoadingMore}
                className="bg-accent/80 text-white px-6 py-3 rounded-full hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    Loading more...
                  </>
                ) : (
                  "Load More Tasks"
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
