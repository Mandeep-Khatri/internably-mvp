import { api } from './client';

export const ResourcesApi = {
  feed: async () => (await api.get('/posts/feed')).data,
  groups: async () => (await api.get('/groups')).data,
  connections: async () => (await api.get('/connections')).data,
  removeConnection: async (userId: string) => (await api.delete(`/connections/${userId}`)).data,
  blockUser: async (userId: string, reason: string) =>
    (await api.post(`/connections/block/${userId}`, { reason })).data,
  notifications: async () => (await api.get('/notifications')).data,
  conversations: async () => (await api.get('/conversations')).data,
  createConversation: async (peerId: string) => (await api.post('/conversations', { peerId })).data,
  usersMe: async () => (await api.get('/users/me')).data,
  userById: async (id: string) => (await api.get(`/users/${id}`)).data,
  updateMe: async (payload: Record<string, unknown>) => (await api.patch('/users/me', payload)).data,
  usersSearch: async (q: string) => (await api.get('/users/search', { params: { q } })).data,
  usersSuggestions: async () => (await api.get('/users/suggestions')).data,
  createPost: async (payload: { content: string; groupId?: string }) => (await api.post('/posts', payload)).data,
  postById: async (id: string) => (await api.get(`/posts/${id}`)).data,
  submitApplication: async (payload: Record<string, unknown>) => (await api.post('/applications', payload)).data,
  mediaUploadUrl: async (payload: { fileName: string; mimeType: string; kind: string }) =>
    (await api.post('/media/upload-url', payload)).data,
  mediaConfirm: async (payload: { url: string; mimeType: string; kind: string }) =>
    (await api.post('/media/confirm', payload)).data,
};
