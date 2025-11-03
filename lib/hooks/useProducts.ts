import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { useUserStore } from "@/lib/store/userStore";

type UseProductsOptions = {
  /** Automatically fetch on mount when a token is available. Defaults to true. */
  enabled?: boolean;
};

type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<Product[]>;
  clearError: () => void;
};

export function useProducts(
  { enabled = true }: UseProductsOptions = {}
): UseProductsResult {
  const token = useUserStore((state) => state.token);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!token) {
      if (isMountedRef.current) {
        setProducts([]);
        setLoading(false);
      }
      return [];
    }

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load products");
      }

      if (isMountedRef.current) {
        setProducts(data.products);
      }

      return data.products as Product[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";

      if (isMountedRef.current) {
        setError(message);
      }

      throw err instanceof Error ? err : new Error(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!enabled) {
      if (isMountedRef.current) {
        setLoading(false);
      }
      return;
    }

    fetchProducts().catch(() => {
      // error state handled inside fetchProducts
    });
  }, [enabled, fetchProducts]);

  const clearError = useCallback(() => {
    if (isMountedRef.current) {
      setError(null);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    clearError,
  };
}
