import { api } from "./axios";
import axios from "axios";
import type {
  CreateJournalEntryInput,
  JournalEntry,
  JournalStats,
  Paginated,
  TrendInsights,
  UpdateJournalEntryInput,
} from "../types/types";

export async function getJournal(page = 1): Promise<Paginated<JournalEntry>> {
  const { data } = await api.get<Paginated<JournalEntry>>("/journal", {
    params: {
      page,
      limit: 20,
    },
  });

  return data;
}

export async function getTodayJournal(
  date: string,
): Promise<JournalEntry | null> {
  try {
    const { data } = await api.get<JournalEntry>(`/journal/${date}`);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function upsertJournal(
  payload: CreateJournalEntryInput,
): Promise<JournalEntry> {
  const { data } = await api.post<JournalEntry>("/journal", payload);

  return data;
}

export async function updateJournal(
  date: string,
  payload: UpdateJournalEntryInput,
): Promise<JournalEntry> {
  const { data } = await api.patch<JournalEntry>(`/journal/${date}`, payload);

  return data;
}

export async function getStats(
  range: "7d" | "30d" | "90d",
): Promise<JournalStats> {
  const { data } = await api.get<JournalStats>("/journal/stats", {
    params: { range },
  });

  return data;
}

export async function getInsights(): Promise<TrendInsights> {
  const { data } = await api.get<TrendInsights>("/journal/insights");

  return data;
}
