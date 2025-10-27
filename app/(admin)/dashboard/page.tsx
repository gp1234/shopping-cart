"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "@/lib/store/userStore";
import type { Product } from "@/lib/data/products";
import ProductFilter from "@/components/ProductFilter/ProductFilter";
import AdminTable from "../components/AdminTable/AdminTable";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";

export default function AdminDashboard() {
  const token = useUserStore((state) => state.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
  useEffect(() => {
    if (!token) return;
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ProductFilter products={products} setFiltered={setFiltered} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add Product
        </Button>
      </Box>
      <AdminTable products={filtered} />
    </>
  );
}
