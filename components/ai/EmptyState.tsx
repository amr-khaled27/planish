import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  hasSearchTerm: boolean;
  searchTerm?: string;
}

export function EmptyState({ hasSearchTerm, searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Sparkles className="mx-auto text-gray-600 mb-4" size={64} />
      {hasSearchTerm ? (
        <>
          <p className="text-gray-400 text-lg">No tasks match your search</p>
          <p className="text-gray-500">
            Try adjusting your search term or clear the search to see all tasks
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-400 text-lg">No active tasks to split</p>
          <p className="text-gray-500">
            Create some tasks to get started with AI planning!
          </p>
        </>
      )}
    </div>
  );
}
