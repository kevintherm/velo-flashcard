import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created: string;
  updated: string;
  user: string;
}

export function useFlashcards() {
  return useQuery({
    queryKey: ['flashcards'],
    queryFn: () => apiFetch<{ data: Flashcard[] }>('collections/flashcards/records').then(res => res.data ?? []),
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { question: string; answer: string; user: string }) =>
      apiFetch('collections/flashcards/records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}

export function useUpdateFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Flashcard> & { id: string }) =>
      apiFetch(`collections/flashcards/records/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`collections/flashcards/records/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}
