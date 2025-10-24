import { create } from "zustand";

type User = {
  id: string;
  email: string;
  role: string;
  tier: number;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },
}));
