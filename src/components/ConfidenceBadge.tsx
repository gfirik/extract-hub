import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  value: number;
}

const ConfidenceBadge = ({ value }: ConfidenceBadgeProps) => {
  const percentage = Math.round(value * 100);

  let colorClasses: string;

  if (value >= 0.8) {
    colorClasses = "bg-emerald-100 text-emerald-700";
  } else if (value >= 0.5) {
    colorClasses = "bg-amber-100 text-amber-700";
  } else {
    colorClasses = "bg-red-100 text-red-700";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
        colorClasses
      )}
    >
      {percentage}%
    </span>
  );
};

export default ConfidenceBadge;
