"use client";
import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Task from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import { TaskTypeSelect } from "./form/TaskTypeSelect";
import { TaskBasics } from "./form/TaskBasics";
import { PrioritySelect } from "./form/PrioritySelect";
import { TaskScheduling } from "./form/TaskScheduling";

interface AddTaskProps {
  isOpen: boolean;
  setIsOpen: () => void;
  onTaskAdded: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "uid">
  ) => Promise<void>;
}

export default function AddTask({
  isOpen,
  setIsOpen,
  onTaskAdded,
}: AddTaskProps) {
  const { user } = useAuth();
  const closeModal = () => setIsOpen();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "task",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: "",
    dueTime: "",
    startTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);

    try {
      const newTaskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "uid"> =
        {
          ...formData,
        };

      console.log("New task data:", newTaskData);

      await onTaskAdded(newTaskData);

      setFormData({
        title: "",
        description: "",
        type: "task",
        status: "todo" as const,
        priority: "medium" as const,
        dueDate: "",
        dueTime: "",
        startTime: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
            onClick={closeModal}
          ></motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 bg-[#111827] rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-white">
                Create New Task
              </h2>

              <form onSubmit={handleSubmit} className="space-y-1">
                <TaskTypeSelect value={formData.type} onChange={handleChange} />

                <TaskBasics
                  title={formData.title}
                  description={formData.description}
                  onChange={handleChange}
                />

                <PrioritySelect
                  value={formData.priority}
                  onChange={handleChange}
                />

                <TaskScheduling
                  taskType={formData.type}
                  dueDate={formData.dueDate}
                  dueTime={formData.dueTime}
                  startTime={formData.startTime}
                  onChange={handleChange}
                />

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-all ${
                      isSubmitting
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-accent hover:bg-accent/80 hover:shadow-lg transform hover:scale-[1.02]"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
