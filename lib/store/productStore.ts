// src/lib/store/productStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/lib/data/products'

type CartState = {
  items: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  toggleCartItem: (product: Product) => void
  clearCart: () => void
  hasHydrated: boolean
  setHasHydrated: (v: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: p => {
        if (!get().items.some(i => i.id === p.id)) set({ items: [...get().items, p] })
      },
      removeFromCart: id => set({ items: get().items.filter(i => i.id !== id) }),
      toggleCartItem: p => (get().items.some(i => i.id === p.id) ? get().removeFromCart(p.id) : get().addToCart(p)),
      clearCart: () => set({ items: [] }),
      hasHydrated: false,
      setHasHydrated: v => set({ hasHydrated: v }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    }
  )
)
