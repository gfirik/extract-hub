import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  value: number;
}

const ConfidenceBadge = ({ value }: ConfidenceBadgeProps) => {
  const percentage = Math.round(value * 100);

  let colorClasses: string;
  if (value > 0.8) {
    colorClasses = "bg-primary/10 text-primary";
  } else if (value > 0.5) {
    colorClasses = "bg-warning/10 text-warning-foreground";
  } else {
    colorClasses = "bg-destructive/10 text-destructive";
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", colorClasses)}>
      {percentage}%
    </span>
  );
};

export default ConfidenceBadge;
