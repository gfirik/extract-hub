import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "extracted" | "needs_review" | "failed";
}

const labels: Record<string, string> = {
  extracted: "Extracted",
  needs_review: "Needs Review",
  failed: "Failed",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorClasses = {
    extracted: "bg-primary/10 text-primary",
    needs_review: "bg-warning/10 text-warning-foreground",
    failed: "bg-destructive/10 text-destructive",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", colorClasses[status])}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
