interface TaskBasicsProps {
  title: string;
  description: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export function TaskBasics({ title, description, onChange }: TaskBasicsProps) {
  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block mb-1 text-sm font-medium text-gray-300"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={onChange}
          placeholder="What needs to be done?"
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500"
        />
        <small className="text-xs text-gray-500 mt-1">
          Keep it clear and actionable
        </small>
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          placeholder="Add any additional details or context..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500"
        />
        <small className="text-xs text-gray-500 mt-1">
          Optional - but helpful for complex tasks
        </small>
      </div>
    </>
  );
}
