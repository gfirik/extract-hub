import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSources } from "@/lib/queries";
import type { Source } from "@/lib/types";

export function useSources() {
  const queryClient = useQueryClient();
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["sources"],
    queryFn: getSources,
  });

  const handleNewSource = useCallback(
    (payload: { new: Source }) => {
      const newSource = payload.new;

      // Highlight new row
      setNewRowIds((prev) => new Set([...prev, newSource.id]));
      setTimeout(() => {
        setNewRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newSource.id);
          return next;
        });
      }, 3000);

      // Add to top of list
      queryClient.setQueryData<Source[]>(["sources"], (old) => {
        if (!old) return [newSource];
        if (old.some((s) => s.id === newSource.id)) return old;
        return [newSource, ...old];
      });
    },
    [queryClient]
  );

  useEffect(() => {
    const channel = supabase
      .channel("sources-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sources" },
        handleNewSource
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleNewSource]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    lastUpdated: new Date(query.dataUpdatedAt || Date.now()),
    newRowIds,
  };
}
