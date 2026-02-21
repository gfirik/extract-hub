import type { ExtractionWithSource } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";
import {
  X,
  Building2,
  Package,
  DollarSign,
  Hash,
  User,
  Mail,
  Phone,
  CreditCard,
  Truck,
  Calendar,
  Send,
  Mail as MailIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExtractionDrawerProps {
  extraction: ExtractionWithSource | null;
  onClose: () => void;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const formatCurrency = (value: number | null): string => {
  if (value === null) return "—";
  return `$${value.toLocaleString()}`;
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Building2;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-start gap-3 py-3", className)}>
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground break-words">{value || "—"}</p>
    </div>
  </div>
);

const ExtractionDrawer = ({ extraction, onClose }: ExtractionDrawerProps) => {
  if (!extraction) return null;

  const sourceType = extraction.sources?.type;
  const SourceIcon = sourceType === "telegram" ? Send : MailIcon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl animate-slide-in-right sm:border-l sm:border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                sourceType === "telegram"
                  ? "bg-gradient-to-br from-sky-100 to-cyan-100"
                  : "bg-gradient-to-br from-blue-100 to-indigo-100"
              )}
            >
              <SourceIcon
                className={cn(
                  "h-5 w-5",
                  sourceType === "telegram" ? "text-sky-600" : "text-blue-600"
                )}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Extraction Details</h2>
              <p className="text-xs text-muted-foreground capitalize">
                From {sourceType || "unknown"} source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Confidence & Date */}
          <div className="mb-6 flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Confidence Score</p>
              <div className="mt-1">
                {extraction.confidence_score !== null ? (
                  <ConfidenceBadge value={extraction.confidence_score} />
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Extracted</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDate(extraction.created_at)}
              </p>
            </div>
          </div>

          {/* Main Details */}
          <div className="divide-y divide-border">
            <DetailRow
              icon={Building2}
              label="Company"
              value={extraction.company_name}
            />
            <DetailRow
              icon={Package}
              label="Product Name"
              value={extraction.product_name}
            />
            <DetailRow
              icon={DollarSign}
              label="Price"
              value={formatCurrency(extraction.price)}
            />
            <DetailRow
              icon={Hash}
              label="Quantity"
              value={extraction.quantity}
            />
            <DetailRow
              icon={User}
              label="Customer Name"
              value={extraction.customer_name}
            />
            <DetailRow
              icon={Mail}
              label="Contact Email"
              value={extraction.contact_email}
            />
            <DetailRow
              icon={Phone}
              label="Contact Phone"
              value={extraction.contact_phone}
            />
            <DetailRow
              icon={CreditCard}
              label="Payment Method"
              value={extraction.payment_method}
            />
            <DetailRow
              icon={Truck}
              label="Delivery Type"
              value={extraction.delivery_type}
            />
            <DetailRow
              icon={Calendar}
              label="Delivery Deadline"
              value={formatDate(extraction.delivery_deadline)}
            />
          </div>

          {/* Source Info */}
          {extraction.sources && (
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Source Information
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sender</span>
                  <span className="font-medium text-foreground">{extraction.sources.sender || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium text-foreground truncate ml-4 max-w-[200px]">
                    {extraction.sources.subject || "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ExtractionDrawer;
