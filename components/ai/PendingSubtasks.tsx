import { Sparkles } from "lucide-react";
import Task from "@/types/task";
import { SubtaskItem } from "./SubtaskItem";

interface PendingSubtasksProps {
  taskId: string;
  subtasks: Task[];
  editingSubtask: string | null;
  editingTitle: string;
  onAcceptAll: (taskId: string) => void;
  onRejectAll: (taskId: string) => void;
  onEditSubtask: (subtaskId: string, currentTitle: string) => void;
  onSaveSubtaskEdit: (taskId: string, subtaskId: string) => void;
  onCancelEdit: () => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onTitleChange: (title: string) => void;
}

export function PendingSubtasks({
  taskId,
  subtasks,
  editingSubtask,
  editingTitle,
  onAcceptAll,
  onRejectAll,
  onEditSubtask,
  onSaveSubtaskEdit,
  onCancelEdit,
  onDeleteSubtask,
  onTitleChange,
}: PendingSubtasksProps) {
  return (
    <div className="mt-4 ml-8 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-green-400 font-medium flex items-center gap-2">
          <Sparkles size={14} />
          AI Generated Subtasks:
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onAcceptAll(taskId)}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={() => onRejectAll(taskId)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
          >
            Reject All
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask.id}
            subtask={subtask}
            taskId={taskId}
            isEditing={editingSubtask === subtask.id}
            editingTitle={editingTitle}
            onEdit={onEditSubtask}
            onSave={onSaveSubtaskEdit}
            onCancel={onCancelEdit}
            onDelete={onDeleteSubtask}
            onTitleChange={onTitleChange}
          />
        ))}
      </div>
    </div>
  );
}
