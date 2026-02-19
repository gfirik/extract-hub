import type { Source } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { Mail, FileText, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface SourceCardProps {
  source: Source;
  onClick: () => void;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return "—";
  }
};

const SourceCard = ({ source, onClick }: SourceCardProps) => {
  const Icon = source.type === "email" ? Mail : FileText;

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-emerald-100 transition-colors group-hover:from-primary/20 group-hover:to-emerald-200">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{source.sender ?? "Unknown sender"}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">{source.subject ?? "No subject"}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{formatDate(source.received_at)}</p>
        <StatusBadge status={source.status} />
      </div>
    </button>
  );
};

export default SourceCard;
