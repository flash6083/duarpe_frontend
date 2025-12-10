/* eslint-disable no-console */
// stores/user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string | number;
  role: string;
};

type UserStore = {
  user: User | null;
  loading: boolean;
  hydrated: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      hydrated: false,

      setUser: (user) => set({ user }),

      fetchUser: async () => {
        set({ loading: true });
        try {
          const res = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include'
          });

          if (!res.ok) throw new Error('Not authenticated');

          const data = await res.json();
          set({ user: data.user, loading: false });
        } catch (err) {
          console.error('Failed to fetch user', err);
          set({ user: null, loading: false });
        }
      },

      clearUser: () => set({ user: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }), // only persist user
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error('rehydration error', error);
        if (state) {
          // ✅ Hydration complete, mark hydrated
          state.hydrated = true;
        }
      }
    }
  )
);
