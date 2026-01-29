import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';

export interface StudySession {
  id: string;
  user: string;
  deck_id?: string;
  correct_count: number;
  total_count: number;
  created: string;
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiFetch<{ data: StudySession[] }>('collections/sessions/records').then(res => res.data ?? []),
  });
}

export function useSaveSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user: string; correct_count: number; total_count: number; deck_id?: string }) =>
      apiFetch('collections/sessions/records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function calculateStreak(sessions: StudySession[]): number {
  if (!sessions || sessions.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD) and sort descending
  const dates = [...new Set(sessions.map(s => s.created.split('T')[0]))]
    .sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If latest session is not today or yesterday, streak is broken
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 0;
  let currentDate = new Date(dates[0]);

  for (let i = 0; i < dates.length; i++) {
    const sessionDate = new Date(dates[i]);
    const diffTime = Math.abs(currentDate.getTime() - sessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (i === 0 || diffDays === 1) {
      streak++;
      currentDate = sessionDate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
}
