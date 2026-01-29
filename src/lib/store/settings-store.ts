import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StudyPace = 'relaxed' | 'normal' | 'fast';
export type StudyMode = 'quiz' | 'flashcard';

interface SettingsState {
  studyPace: StudyPace;
  studyMode: StudyMode;
  setStudyPace: (pace: StudyPace) => void;
  setStudyMode: (mode: StudyMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      studyPace: 'normal',
      studyMode: 'quiz',
      setStudyPace: (pace) => set({ studyPace: pace }),
      setStudyMode: (mode) => set({ studyMode: mode }),
    }),
    {
      name: 'velo-settings',
    }
  )
);
