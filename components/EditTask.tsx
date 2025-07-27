"use client";
import { useState, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Task from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import { TaskTypeSelect } from "./form/TaskTypeSelect";
import { TaskBasics } from "./form/TaskBasics";
import { PrioritySelect } from "./form/PrioritySelect";
import { StatusSelect } from "./form/StatusSelect";
import { TaskScheduling } from "./form/TaskScheduling";

interface EditTaskProps {
  isOpen: boolean;
  setIsOpen: () => void;
  task: Task | null;
  onTaskUpdated: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "uid">>
  ) => Promise<void>;
}

export default function EditTask({
  isOpen,
  setIsOpen,
  task,
  onTaskUpdated,
}: EditTaskProps) {
  const { user } = useAuth();
  const closeModal = () => setIsOpen();
  const [isSubmitting, setIsSubmitting] = useState(false);

  type StatusType = "todo" | "in-progress" | "done";
  type PriorityType = "low" | "medium" | "high" | "urgent";

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: string;
    status: StatusType;
    priority: PriorityType;
    dueDate: string;
    dueTime: string;
    startTime: string;
  }>({
    title: "",
    description: "",
    type: "task",
    status: "todo",
    priority: "medium",
    dueDate: "",
    dueTime: "",
    startTime: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        type: task.type || "task",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate || "",
        dueTime: task.dueTime || "",
        startTime: task.startTime || "",
      });
    }
  }, [task]);

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

    if (!user || !task) return;

    setIsSubmitting(true);

    try {
      console.log(`Updating task with ID: ${task.id}`);

      const updatedTaskData = {
        ...formData,
      };

      await onTaskUpdated(task.id, updatedTaskData);
    } catch (error) {
      console.error("Error updating task:", error);
      console.error("Task ID that failed:", task.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
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
            onClick={closeModal}
          >
            <div onClick={(e) => e.stopPropagation()} className="relative p-6 bg-[#111827] rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                ✏️ Edit Task
              </h2>

              <form onSubmit={handleSubmit} className="space-y-1">
                <TaskTypeSelect value={formData.type} onChange={handleChange} />

                <TaskBasics
                  title={formData.title}
                  description={formData.description}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-2 gap-3">
                  <StatusSelect
                    value={formData.status}
                    onChange={handleChange}
                  />

                  <PrioritySelect
                    value={formData.priority}
                    onChange={handleChange}
                  />
                </div>

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
                        : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </span>
                    ) : (
                      "Save Changes"
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
