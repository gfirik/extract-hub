import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getExtractions } from "@/lib/queries";
import type { ExtractionWithSource } from "@/lib/types";

export function useExtractions() {
  const queryClient = useQueryClient();
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["extractions"],
    queryFn: getExtractions,
  });

  const handleNewExtraction = useCallback(
    (payload: { new: ExtractionWithSource }) => {
      const newExtraction = payload.new;

      // Highlight new row
      setNewRowIds((prev) => new Set([...prev, newExtraction.id]));
      setTimeout(() => {
        setNewRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newExtraction.id);
          return next;
        });
      }, 3000);

      // Add to top of list
      queryClient.setQueryData<ExtractionWithSource[]>(
        ["extractions"],
        (old) => {
          if (!old) return [newExtraction];
          if (old.some((e) => e.id === newExtraction.id)) return old;
          return [newExtraction, ...old];
        }
      );

      // Refresh stats since counts changed
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    [queryClient]
  );

  useEffect(() => {
    const channel = supabase
      .channel("extractions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "extractions" },
        handleNewExtraction
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleNewExtraction]);

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
