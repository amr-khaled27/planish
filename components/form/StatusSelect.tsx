interface StatusSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  const getStatusDescription = (status: string) => {
    switch (status) {
      case "todo":
        return "Ready to start";
      case "in-progress":
        return "Currently working on this";
      case "done":
        return "Completed successfully";
      default:
        return "";
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="status"
        className="block mb-1 text-sm font-medium text-gray-300"
      >
        Current Status
      </label>
      <select
        id="status"
        name="status"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
      >
        <option value="todo">📋 To Do</option>
        <option value="in-progress">⚡ In Progress</option>
        <option value="done">✅ Done</option>
      </select>
      <small className="text-xs text-gray-500 mt-1">
        {getStatusDescription(value)}
      </small>
    </div>
  );
}
