import { Sparkles } from "lucide-react";

interface SplitButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SplitButton({
  isLoading,
  onClick,
  disabled = false,
}: SplitButtonProps) {
  return (
    <div className="flex-shrink-0">
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`
          h-full px-4 py-2 rounded-lg border-2 border-dashed
          transition-all duration-200 flex items-center gap-2
          ${
            isLoading
              ? "border-purple-400 bg-purple-400/10 text-purple-300"
              : "border-purple-500 hover:border-purple-400 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300"
          }
          disabled:cursor-not-allowed
        `}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
            <span className="text-sm font-medium">Splitting...</span>
          </>
        ) : (
          <>
            <Sparkles size={16} />
            <span className="text-sm font-medium">Split Task</span>
          </>
        )}
      </button>
    </div>
  );
}
