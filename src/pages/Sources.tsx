import { useEffect, useState } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import SourceCard from "@/components/SourceCard";
import SourceDrawer from "@/components/SourceDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { getSources } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
import type { Source } from "@/lib/types";

const Sources = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [selected, setSelected] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await getSources();
      setSources(data);
    } catch (err) {
      console.error("Error fetching sources:", err);
      setError("Failed to load sources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscription for sources
    const channel = supabase
      .channel("sources-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sources" },
        () => {
          // Refetch all data when sources change
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (error) {
    return (
      <div className="px-8 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 py-20">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">Error Loading Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">Sources</h1>
        <p className="mt-1 text-sm text-muted-foreground">Incoming emails and documents feeding your pipeline.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      ) : sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20">
          <Inbox className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No sources yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Incoming emails and documents will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map(source => (
            <SourceCard key={source.id} source={source} onClick={() => setSelected(source)} />
          ))}
        </div>
      )}

      <SourceDrawer source={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Sources;
