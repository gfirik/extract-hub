import { useState, useMemo } from "react";
import { ArrowUpDown, Inbox } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import type { ExtractionWithSource } from "@/lib/types";
import { format } from "date-fns";

interface DataTableProps {
  data: ExtractionWithSource[];
}

type SortKey = "company_name" | "customer_name" | "price" | "quantity" | "payment_method" | "delivery_type" | "contact_email" | "confidence_score" | "created_at";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "company_name", label: "Company" },
  { key: "customer_name", label: "Customer" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "payment_method", label: "Payment Method" },
  { key: "delivery_type", label: "Delivery Type" },
  { key: "contact_email", label: "Contact" },
  { key: "confidence_score", label: "Confidence" },
  { key: "created_at", label: "Date" },
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

const DataTable = ({ data }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Handle nulls - push to end
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
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20">
        <Inbox className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No extractions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">Extracted data from your sources will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(row => (
              <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{row.company_name ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.customer_name ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{formatCurrency(row.price)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.quantity ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.payment_method ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.delivery_type ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.contact_email ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {row.confidence_score !== null ? (
                    <ConfidenceBadge value={row.confidence_score} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
