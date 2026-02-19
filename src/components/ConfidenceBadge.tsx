import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  value: number;
}

const ConfidenceBadge = ({ value }: ConfidenceBadgeProps) => {
  const percentage = Math.round(value * 100);

  let colorClasses: string;
  let bgGradient: string;

  if (value >= 0.8) {
    colorClasses = "text-emerald-700";
    bgGradient = "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/50";
  } else if (value >= 0.5) {
    colorClasses = "text-amber-700";
    bgGradient = "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50";
  } else {
    colorClasses = "text-red-700";
    bgGradient = "bg-gradient-to-r from-red-50 to-rose-50 border-red-200/50";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        bgGradient,
        colorClasses
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          value >= 0.8 ? "bg-emerald-500" : value >= 0.5 ? "bg-amber-500" : "bg-red-500"
        )}
      />
      {percentage}%
    </span>
  );
};

export default ConfidenceBadge;
