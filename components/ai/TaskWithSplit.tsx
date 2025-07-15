import { Sparkles } from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import Task from "@/types/task";
import { SplitButton } from "./SplitButton";
import { PendingSubtasks } from "./PendingSubtasks";

interface TaskWithSplitProps {
  task: Task;
  index: number;
  isBeingSplit: boolean;
  pendingSubtasks?: Task[];
  pendingStatus?: "pending" | "accepted" | "rejected";
  splitResults?: Task[];
  editingSubtask: string | null;
  editingTitle: string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleDone: (taskId: string, isDone: boolean) => void;
  onSplit: (task: Task) => void;
  onAcceptSubtasks: (taskId: string) => void;
  onRejectSubtasks: (taskId: string) => void;
  onEditSubtask: (subtaskId: string, currentTitle: string) => void;
  onSaveSubtaskEdit: (taskId: string, subtaskId: string) => void;
  onCancelEdit: () => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onTitleChange: (title: string) => void;
}

export function TaskWithSplit({
  task,
  index,
  isBeingSplit,
  pendingStatus,
  splitResults,
  editingSubtask,
  editingTitle,
  onEdit,
  onDelete,
  onToggleDone,
  onSplit,
  onAcceptSubtasks,
  onRejectSubtasks,
  onEditSubtask,
  onSaveSubtaskEdit,
  onCancelEdit,
  onDeleteSubtask,
  onTitleChange,
}: TaskWithSplitProps) {
  return (
    <div className="relative">
      <div className="flex gap-4">
        <div className="flex-1">
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleDone={onToggleDone}
            index={index}
          />
        </div>

        <SplitButton
          isLoading={isBeingSplit}
          onClick={() => onSplit(task)}
          disabled={isBeingSplit}
        />
      </div>

      {splitResults && pendingStatus === "pending" && (
        <PendingSubtasks
          taskId={task.id}
          subtasks={splitResults}
          editingSubtask={editingSubtask}
          editingTitle={editingTitle}
          onAcceptAll={onAcceptSubtasks}
          onRejectAll={onRejectSubtasks}
          onEditSubtask={onEditSubtask}
          onSaveSubtaskEdit={onSaveSubtaskEdit}
          onCancelEdit={onCancelEdit}
          onDeleteSubtask={onDeleteSubtask}
          onTitleChange={onTitleChange}
        />
      )}

      {pendingStatus === "accepted" && (
        <div className="mt-4 ml-8">
          <p className="text-sm text-green-400 font-medium flex items-center gap-2">
            <Sparkles size={14} />✅ Subtasks accepted and added to your task
            list!
          </p>
        </div>
      )}
    </div>
  );
}
