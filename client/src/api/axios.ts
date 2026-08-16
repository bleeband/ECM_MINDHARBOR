import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex. http://localhost:3000/api/v1
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

let refreshing: Promise<{ data: { accessToken: string } }> | null = null;
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        refreshing ??= api.post("/auth/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        const { data } = await refreshing;
        refreshing = null;
        localStorage.setItem("accessToken", data.accessToken);
        return api(original); // on rejoue la requete d’origine
      } catch {
        refreshing = null;
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
