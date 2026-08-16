import { api } from "./axios";
import type { Paginated, Resource, TypeResource } from "../types/types";

export async function getResources(params: {
  page?: number;
  q?: string;
  type?: TypeResource;
}): Promise<Paginated<Resource>> {
  const { data } = await api.get<Paginated<Resource>>("/resources", {
    params: { page: params.page ?? 1, limit: 20, ...params },
  });
  return data;
}

export async function addFavorite(id: string): Promise<void> {
  await api.post(`/resources/${id}/favorite`);
}

export async function removeFavorite(id: string): Promise<void> {
  await api.delete(`/resources/${id}/favorite`);
}

export async function getFavorites(): Promise<Paginated<Resource>> {
  const { data } = await api.get<Paginated<Resource>>("/resources/me/favorites");
  return data;
}
