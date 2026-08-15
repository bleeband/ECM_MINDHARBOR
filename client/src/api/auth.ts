import { api } from "./axios";
import type { AuthSession, AuthUser, RegisterResponse } from "../types/types";

export async function login(payload: { email: string; password: string }): Promise<AuthSession> {
  const { data } = await api.post<AuthSession>("/auth/login", payload);
  return data;
}

export async function register(payload: {
  email: string;
  password: string;
  pseudonyme: string;
}): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
}

export async function me(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>("/auth/me");
  return data.user;
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>("/auth/refresh", { refreshToken });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
