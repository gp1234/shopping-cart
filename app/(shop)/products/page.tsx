"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "@/lib/store/userStore";
import ProductsTable from "@/components/VirtualizedTable/VirtualizedTable";
import type { Product } from "@/lib/data/products";
import ProductFilter from "@/components/ProductFilter/ProductFilter";
import {
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";


export default function ProductsData() {
  const token = useUserStore((state) => state.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load products");
        }

        setProducts(data.products);
        setFiltered(data.products);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [token]);

  if (loading)
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <ProductFilter products={products} setFiltered={setFiltered} />
      <ProductsTable products={filtered} />
    </>
  );
}
