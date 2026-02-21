import { supabase } from "./supabase";
import type { Source, ExtractionWithSource, Stats } from "./types";

export async function getExtractions(): Promise<ExtractionWithSource[]> {
  try {
    const { data, error } = await supabase
      .from("extractions")
      .select(`
        *,
        sources (
          id,
          type,
          sender,
          subject,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching extractions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch extractions:", error);
    throw error;
  }
}

export async function getSources(): Promise<Source[]> {
  try {
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sources:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch sources:", error);
    throw error;
  }
}

export async function getStats(): Promise<Stats> {
  try {
    // Get total count of extractions
    const { count: total, error: totalError } = await supabase
      .from("extractions")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      console.error("Error fetching total count:", totalError);
      throw totalError;
    }

    // Get today's extractions count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: todayCount, error: todayError } = await supabase
      .from("extractions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    if (todayError) {
      console.error("Error fetching today count:", todayError);
      throw todayError;
    }

    // Get extractions with source type to calculate stats
    const { data: extractionsData, error: extractionsError } = await supabase
      .from("extractions")
      .select(`
        confidence_score,
        sources (type)
      `);

    if (extractionsError) {
      console.error("Error fetching extractions data:", extractionsError);
      throw extractionsError;
    }

    // Calculate average confidence
    const scores = extractionsData
      ?.map((e) => e.confidence_score)
      .filter((s): s is number => s !== null) || [];

    const avgConfidence = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100)
      : 0;

    // Find top source type
    let emailCount = 0;
    let telegramCount = 0;

    extractionsData?.forEach((e) => {
      const sourceType = (e.sources as { type?: string } | null)?.type;
      if (sourceType === "email") emailCount++;
      else if (sourceType === "telegram") telegramCount++;
    });

    let topSourceType: "email" | "telegram" | null = null;
    if (emailCount > 0 || telegramCount > 0) {
      topSourceType = emailCount >= telegramCount ? "email" : "telegram";
    }

    return {
      total: total || 0,
      today: todayCount || 0,
      avgConfidence,
      topSourceType,
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
}
