import { api } from './axios';
import type {
  CreatePostInput,
  Group,
  GroupMember,
  Paginated,
  Post,
} from '../types/types';

export async function getGroups(params: { page?: number; q?: string } = {}): Promise<Paginated<Group>> {
  const { data } = await api.get<Paginated<Group>>('/groups', { params: { page: params.page ?? 1, limit: 20, ...params } });
  return data;
}

export async function getGroup(id: string): Promise<Group> {
  const { data } = await api.get<Group>(`/groups/${id}`);
  return data;
}

export async function joinGroup(id: string): Promise<GroupMember> {
  const { data } = await api.post<GroupMember>(`/groups/${id}/join`);
  return data;
}

export async function getGroupPosts(id: string, page = 1): Promise<Paginated<Post>> {
  const { data } = await api.get<Paginated<Post>>(`/groups/${id}/posts`, { params: { page, limit: 20 } });
  return data;
}

export async function createPost(
  id: string,
  payload: CreatePostInput,
): Promise<Post> {
  const { data } = await api.post<Post>(`/groups/${id}/posts`, payload);
  return data;
}
