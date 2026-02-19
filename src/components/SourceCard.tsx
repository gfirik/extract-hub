import type { Source } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { Mail } from "lucide-react";
import { format } from "date-fns";

interface SourceCardProps {
  source: Source;
  onClick: () => void;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const SourceCard = ({ source, onClick }: SourceCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{source.sender ?? "—"}</p>
            <p className="truncate text-sm text-muted-foreground">{source.subject ?? "—"}</p>
          </div>
        </div>
        <StatusBadge status={source.status} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{formatDate(source.received_at)}</p>
    </button>
  );
};

export default SourceCard;
