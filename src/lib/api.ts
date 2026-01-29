import { useAuthStore } from './store/auth-store';

export const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const BASE_API_URL = `${BASE_URL}/api/`;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  
  const token = useAuthStore.getState().token;
  
  const isFormData = options?.body instanceof FormData;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
