import { LucideIcon } from "lucide-react";

interface AIStatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: number;
  subValue?: number;
  subLabel?: string;
}

export function AIStatsCard({
  icon: Icon,
  iconColor,
  label,
  value,
  subValue,
  subLabel,
}: AIStatsCardProps) {
  return (
    <div className="bg-[#111827] p-4 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2">
        <Icon className={iconColor} size={20} />
        <span className="text-gray-300">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white mt-1">
        {value}
        {subValue !== undefined && subLabel && (
          <span className="text-sm text-gray-400 ml-2">
            {subLabel} {subValue}
          </span>
        )}
      </p>
    </div>
  );
}
