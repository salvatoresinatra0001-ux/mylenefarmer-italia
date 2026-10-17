import { create } from "zustand";

type PlayerState = {
  slug: string | null;
  open: (slug: string) => void;
  close: () => void;
};

export const usePlayer = create<PlayerState>((set) => ({
  slug: null,
  open: (slug) => set({ slug }),
  close: () => set({ slug: null }),
}));
