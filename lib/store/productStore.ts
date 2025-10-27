import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/data/products";

type CartState = {
  products: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  toggleCartItem: (product: Product) => void;
  clearCart: () => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      products: [],
      addToCart: (product) => {
        if (!get().products.some((item) => item.id === product.id))
          set({ products: [...get().products, product] });
      },
      removeFromCart: (id) =>
        set({ products: get().products.filter((item) => item.id !== id) }),
      toggleCartItem: (product) =>
        get().products.some((item) => item.id === product.id)
          ? get().removeFromCart(product.id)
          : get().addToCart(product),
      clearCart: () => set({ products: [] }),
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
