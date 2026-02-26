"use client";

import { create } from "zustand";

interface CartUiStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartUiStore = create<CartUiStore>()((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
