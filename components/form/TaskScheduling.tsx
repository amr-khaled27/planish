interface TaskSchedulingProps {
  taskType: string;
  dueDate: string;
  dueTime: string;
  startTime: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TaskScheduling({
  taskType,
  dueDate,
  dueTime,
  startTime,
  onChange,
}: TaskSchedulingProps) {
  const getSchedulingHint = () => {
    switch (taskType) {
      case "deadline":
        return "When is this due?";
      case "task":
        return "When will you work on this?";
      case "project":
        return "Project completion target";
      case "assignment":
        return "Assignment submission date";
      default:
        return "Set your timeline";
    }
  };

  return (
    <div className="border-t border-gray-700 pt-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
        📅 Scheduling
        <span className="text-xs text-gray-500">({getSchedulingHint()})</span>
      </h3>

      {taskType === "deadline" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="dueDate"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dueTime"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Due Time
            </label>
            <input
              type="time"
              id="dueTime"
              name="dueTime"
              value={dueTime}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
            />
            <small className="text-xs text-gray-500 mt-1">
              Optional - helps with calendar planning
            </small>
          </div>
        </>
      )}

      {(taskType === "task" || taskType === "subtask" || taskType === "habit") && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label
                htmlFor="startTime"
                className="block mb-1 text-xs font-medium text-gray-300"
              >
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={onChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="dueTime"
                className="block mb-1 text-xs font-medium text-gray-300"
              >
                End Time
              </label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={dueTime}
                onChange={onChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white text-sm"
              />
            </div>
          </div>
          {taskType !== "habit" && (
          <div className="mb-4">
            <label
              htmlFor="dueDate"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Work Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
            />
            <small className="text-xs text-gray-500 mt-1">
              When do you plan to work on this?
            </small>
          </div>
          )}
        </>
      )}

      {(taskType === "project" || taskType === "assignment") && (
        <>
          <div className="mb-4">
            <label
              htmlFor="dueDate"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Target Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dueTime"
              className="block mb-1 text-sm font-medium text-gray-300"
            >
              Target Time
            </label>
            <input
              type="time"
              id="dueTime"
              name="dueTime"
              value={dueTime}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
            />
            <small className="text-xs text-gray-500 mt-1">
              {taskType === "assignment"
                ? "Submission deadline"
                : "Completion target time"}
            </small>
          </div>
        </>
      )}
    </div>
  );
}
