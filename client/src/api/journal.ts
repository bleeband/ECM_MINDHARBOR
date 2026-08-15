import { api } from "./axios";
import type { JournalEntry, Paginated, TrendInsights, TrendSeriesPoint } from "../types/types";

export async function getJournal(page = 1): Promise<Paginated<JournalEntry>> {
  const { data } = await api.get<Paginated<JournalEntry>>("/journal", { params: { page, limit: 20 } });
  return data;
}

export async function getTodayJournal(date: string): Promise<JournalEntry | null> {
  const { data } = await api.get<JournalEntry | null>("/journal/date", { params: { date } });
  return data;
}

export async function upsertJournal(payload: Partial<JournalEntry>): Promise<JournalEntry> {
  const { data } = await api.post<JournalEntry>("/journal", payload);
  return data;
}

export async function updateJournal(date: string, payload: Partial<JournalEntry>): Promise<JournalEntry> {
  const { data } = await api.patch<JournalEntry>("/journal/date", payload, { params: { date } });
  return data;
}

export async function getStats(range: "7d" | "30d" | "90d"): Promise<{ series: TrendSeriesPoint[] }> {
  const { data } = await api.get<{ series: TrendSeriesPoint[] }>("/journal/stats", { params: { range } });
  return data;
}

export async function getInsights(): Promise<TrendInsights> {
  const { data } = await api.get<TrendInsights>("/journal/insights");
  return data;
}
