import { Edit, Trash, Check } from "lucide-react";
import Task from "@/types/task";
import { formatTimeToAMPM } from "@/utils/calendar";
import { motion } from "motion/react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleDone: (taskId: string, isDone: boolean) => void;
  index?: number;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleDone,
  index = 0,
}: TaskCardProps) {
  const isDone = task.status === "done";

  const handleToggleDone = () => {
    onToggleDone(task.id, !isDone);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.9,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      className={`bg-[#111827] duration-300 hover:bg-[#172035] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        isDone ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDone}
              className={`min-w-[1.5rem] min-h-[1.5rem] rounded border-2 flex items-center justify-center transition-colors ${
                isDone
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-400 hover:border-green-400"
              }`}
              aria-label={isDone ? "Mark as not done" : "Mark as done"}
            >
              {isDone && <Check size={14} />}
            </button>
          <h2
            className={`font-semibold text-lg ${
              isDone ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h2>
        </div>

        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
          {task.type}
        </span>
      </div>
      <p className={`text-gray-600 mb-3 ${isDone ? "line-through" : ""}`}>
        {task.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            task.status === "todo"
              ? "bg-yellow-200 text-yellow-800"
              : task.status === "in-progress"
              ? "bg-blue-200 text-blue-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {task.status}
        </span>

        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            task.priority === "high"
              ? "bg-red-200 text-red-800"
              : task.priority === "medium"
              ? "bg-orange-200 text-orange-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-200 text-purple-800">
            Due: {new Date(task.dueDate).toLocaleDateString()}
            {task.dueTime && ` at ${formatTimeToAMPM(task.dueTime)}`}
          </span>
        )}
      </div>

      {/* Task Actions */}
      <div className="flex justify-end mt-3 space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Edit task"
        >
          <Edit size={16} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Trash size={16} />
        </button>
      </div>
    </motion.div>
  );
}
