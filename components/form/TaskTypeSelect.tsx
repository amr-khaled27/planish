interface TaskTypeSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function TaskTypeSelect({ value, onChange }: TaskTypeSelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor="type"
        className="block mb-1 text-sm font-medium text-gray-300"
      >
        Task Type
      </label>
      <select
        id="type"
        name="type"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
      >
        <option value="task">Task</option>
        <option value="deadline">Deadline</option>
        <option value="project">Project</option>
        <option value="assignment">Assignment</option>
        <option value="habit">Habit</option>
      </select>
      <small className="text-xs text-gray-500 mt-1">
        Pick the task category that best fits your work
      </small>
    </div>
  );
}
