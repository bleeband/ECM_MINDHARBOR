import { api } from "./axios";
import type { JournalEntry, Paginated } from "../types";

export async function getJournal(page = 1): Promise<Paginated<JournalEntry>> {
  const { data } = await api.get<Paginated<JournalEntry>>("/journal", {
    params: { page, limit: 20 },
  });
  return data;
}
