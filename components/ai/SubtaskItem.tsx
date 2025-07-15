import Task from "@/types/task";

interface SubtaskItemProps {
  subtask: Task;
  taskId: string;
  isEditing: boolean;
  editingTitle: string;
  onEdit: (subtaskId: string, currentTitle: string) => void;
  onSave: (taskId: string, subtaskId: string) => void;
  onCancel: () => void;
  onDelete: (taskId: string, subtaskId: string) => void;
  onTitleChange: (title: string) => void;
}

export function SubtaskItem({
  subtask,
  taskId,
  isEditing,
  editingTitle,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTitleChange,
}: SubtaskItemProps) {
  return (
    <div className="bg-[#0f1419] border border-purple-500/20 rounded-lg p-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-300 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSave(taskId, subtask.id);
                } else if (e.key === "Escape") {
                  onCancel();
                }
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded text-sm flex-1 border border-purple-500/40 focus:border-purple-400 outline-none"
              autoFocus
            />
          ) : (
            <span className="font-medium flex-1">{subtask.title}</span>
          )}

          {subtask.dueDate && (
            <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">
              Due: {new Date(subtask.dueDate).toLocaleDateString()}
              {subtask.dueTime && ` at ${subtask.dueTime}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {isEditing ? (
            <>
              <button
                onClick={() => onSave(taskId, subtask.id)}
                className="p-1 text-green-400 hover:text-green-300 rounded text-xs"
                title="Save"
              >
                ✓
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-400 hover:text-red-300 rounded text-xs"
                title="Cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(subtask.id, subtask.title)}
                className="p-1 text-blue-400 hover:text-blue-300 rounded text-xs"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(taskId, subtask.id)}
                className="p-1 text-red-400 hover:text-red-300 rounded text-xs"
                title="Delete"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
