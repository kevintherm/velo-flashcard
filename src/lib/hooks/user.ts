import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';
import { useAuthStore } from '../store/auth-store';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, setAuth, token } = useAuthStore.getState();

  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<any>(`collections/users/records/${user?.id}`, {
        method: 'PATCH',
        body: data,
      }),
    onSuccess: (response) => {
      const updatedUser = response.data || response;
      setAuth(updatedUser, token!);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
