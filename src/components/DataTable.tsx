import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox, Mail, Send, ChevronRight } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import ExtractionDrawer from "./ExtractionDrawer";
import type { ExtractionWithSource } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: ExtractionWithSource[];
  newRowIds?: Set<string>;
}

type SortKey =
  | "company_name"
  | "product_name"
  | "price"
  | "quantity"
  | "customer_name"
  | "contact_email"
  | "payment_method"
  | "delivery_type"
  | "delivery_deadline"
  | "confidence_score"
  | "created_at";

type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string; width: string }[] = [
  { key: "company_name", label: "Company", width: "w-[130px]" },
  { key: "product_name", label: "Product", width: "w-[120px]" },
  { key: "price", label: "Price", width: "w-[70px]" },
  { key: "quantity", label: "Qty", width: "w-[45px]" },
  { key: "customer_name", label: "Customer", width: "w-[100px]" },
  { key: "contact_email", label: "Contact", width: "w-[130px]" },
  { key: "payment_method", label: "Payment", width: "w-[90px]" },
  { key: "delivery_type", label: "Delivery", width: "w-[60px]" },
  { key: "delivery_deadline", label: "Deadline", width: "w-[75px]" },
  { key: "confidence_score", label: "Conf.", width: "w-[55px]" },
  { key: "created_at", label: "Date", width: "w-[70px]" },
];

const formatCurrency = (value: number | null): string => {
  if (value === null) return "—";
  return `$${value.toLocaleString()}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d");
  } catch {
    return "—";
  }
};

const SourceTypeIcon = ({ type }: { type?: string }) => {
  if (type === "telegram") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50" title="Telegram">
        <Send className="h-3.5 w-3.5 text-sky-600" />
      </div>
    );
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50" title="Email">
      <Mail className="h-3.5 w-3.5 text-blue-600" />
    </div>
  );
};

const DataTable = ({ data, newRowIds = new Set() }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedExtraction, setSelectedExtraction] = useState<ExtractionWithSource | null>(null);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return (
        <ArrowUpDown className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
      );
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 sm:py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="mt-5 text-base font-semibold text-foreground">
          No extractions yet
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground text-center max-w-xs px-4">
          Waiting for emails and Telegram messages...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold text-muted-foreground w-10">
                  <span className="sr-only">Source</span>
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "group cursor-pointer whitespace-nowrap px-2 py-3 text-left text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground",
                      col.width
                    )}
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </span>
                  </th>
                ))}
                <th className="w-8 px-2 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sorted.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedExtraction(row)}
                  className={cn(
                    "group cursor-pointer transition-colors",
                    newRowIds.has(row.id)
                      ? "bg-primary/5 animate-pulse"
                      : "hover:bg-muted/40"
                  )}
                >
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <SourceTypeIcon type={row.sources?.type} />
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[0].width)}>
                    <span className="block truncate text-sm font-medium text-foreground" title={row.company_name ?? undefined}>
                      {row.company_name ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[1].width)}>
                    <span className="block truncate text-sm text-muted-foreground" title={row.product_name ?? undefined}>
                      {row.product_name ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5 text-sm font-medium text-foreground", columns[2].width)}>
                    {formatCurrency(row.price)}
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5 text-sm text-muted-foreground text-center", columns[3].width)}>
                    {row.quantity ?? "—"}
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[4].width)}>
                    <span className="block truncate text-sm text-foreground" title={row.customer_name ?? undefined}>
                      {row.customer_name ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[5].width)}>
                    <span className="block truncate text-sm text-muted-foreground" title={row.contact_email ?? undefined}>
                      {row.contact_email ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[6].width)}>
                    <span className="block truncate text-sm text-muted-foreground" title={row.payment_method ?? undefined}>
                      {row.payment_method ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[7].width)}>
                    <span className="block truncate text-sm text-muted-foreground" title={row.delivery_type ?? undefined}>
                      {row.delivery_type ?? "—"}
                    </span>
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5 text-sm text-muted-foreground", columns[8].width)}>
                    {formatDate(row.delivery_deadline)}
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5", columns[9].width)}>
                    {row.confidence_score !== null ? (
                      <ConfidenceBadge value={row.confidence_score} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className={cn("whitespace-nowrap px-2 py-2.5 text-sm text-muted-foreground", columns[10].width)}>
                    {formatDate(row.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5">
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExtractionDrawer
        extraction={selectedExtraction}
        onClose={() => setSelectedExtraction(null)}
      />
    </>
  );
};

export default DataTable;
