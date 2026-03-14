import { create } from "zustand";
import { storage } from "../utils/storage";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: async () => {
    await storage.removeItem("zenda_token");
    set({ user: null, token: null });
  },
}));
