import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox, Mail } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
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

const columns: { key: SortKey; label: string; hideOnMobile?: boolean }[] = [
  { key: "company_name", label: "Company" },
  { key: "product_name", label: "Product Name" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity", hideOnMobile: true },
  { key: "customer_name", label: "Customer Name", hideOnMobile: true },
  { key: "contact_email", label: "Contact/Email", hideOnMobile: true },
  { key: "payment_method", label: "Transaction Type", hideOnMobile: true },
  { key: "delivery_type", label: "Delivery Type", hideOnMobile: true },
  { key: "delivery_deadline", label: "Delivery Deadline", hideOnMobile: true },
  { key: "confidence_score", label: "Confidence" },
  { key: "created_at", label: "Date", hideOnMobile: true },
];

const formatCurrency = (value: number | null): string => {
  if (value === null) return "—";
  return `$${value.toLocaleString()}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const formatDeadline = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
};

const DataTable = ({ data, newRowIds = new Set() }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

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
        <ArrowUpDown className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
      );
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 sm:py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Mail className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground">
          No extractions yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm px-4">
          Waiting for emails... Extracted data will appear here once the
          pipeline processes incoming messages.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "group cursor-pointer whitespace-nowrap px-4 py-4 text-left font-semibold text-muted-foreground transition-colors hover:text-foreground",
                    col.hideOnMobile && "hidden xl:table-cell"
                  )}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-2">
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "group transition-all",
                  newRowIds.has(row.id)
                    ? "bg-primary/5 animate-pulse"
                    : "hover:bg-muted/30"
                )}
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="font-semibold text-foreground">
                    {row.company_name ?? "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-foreground">
                  {row.product_name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="font-medium text-foreground">
                    {formatCurrency(row.price)}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground xl:table-cell">
                  {row.quantity ?? "—"}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-foreground xl:table-cell">
                  {row.customer_name ?? "—"}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground xl:table-cell">
                  {row.contact_email ?? "—"}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 xl:table-cell">
                  {row.payment_method ? (
                    <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {row.payment_method}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 xl:table-cell">
                  {row.delivery_type ? (
                    <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {row.delivery_type}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground xl:table-cell">
                  {formatDeadline(row.delivery_deadline)}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  {row.confidence_score !== null ? (
                    <ConfidenceBadge value={row.confidence_score} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-muted-foreground xl:table-cell">
                  {formatDate(row.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
