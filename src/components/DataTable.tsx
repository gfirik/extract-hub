import { useState, useMemo } from "react";
import { ArrowUpDown, Inbox } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import { Extraction } from "@/data/mockData";

interface DataTableProps {
  data: Extraction[];
}

type SortKey = keyof Extraction;
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "customer", label: "Customer" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "deliveryType", label: "Delivery Type" },
  { key: "contact", label: "Contact" },
  { key: "confidence", label: "Confidence" },
  { key: "date", label: "Date" },
];

const DataTable = ({ data }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
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
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{row.company}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.customer}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">${row.price.toLocaleString()}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.quantity}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.paymentMethod}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.deliveryType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.contact}</td>
                <td className="whitespace-nowrap px-4 py-3"><ConfidenceBadge value={row.confidence} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
