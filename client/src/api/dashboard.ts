import { api } from "./axios";
import type { DashboardData } from "../types/types";

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}
