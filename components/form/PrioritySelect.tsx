interface PrioritySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const getPriorityDescription = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Needs immediate attention";
      case "high":
        return "Important and time-sensitive";
      case "medium":
        return "Standard priority level";
      case "low":
        return "Can be done when time allows";
      default:
        return "";
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="priority"
        className="block mb-1 text-sm font-medium text-gray-300"
      >
        Priority Level
      </label>
      <select
        id="priority"
        name="priority"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
      >
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🟠 High</option>
        <option value="urgent">🔴 Urgent</option>
      </select>
      <small className="text-xs text-gray-500 mt-1">
        {getPriorityDescription(value)}
      </small>
    </div>
  );
}
