"use client";
import AdminTable from "../components/AdminTable/AdminTable";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import type { Product } from "@/lib/data/products";
import { BaseModal } from "@/components/common/Modal/Modal";
import { ProductForm } from "../components/ProductForm/ProductForm";
import ProductFilter from "@/components/common/ProductFilter/ProductFilter";
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
  const [editing, setEditing] = useState<Product | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load products");

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccess = () => {
    fetchProducts();
    handleCloseModal();
  };

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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Total Products: {products.length}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add Product
        </Button>
      </Box>
      <ProductFilter products={products} setFiltered={setFiltered} />
      <AdminTable
        products={filtered}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      <BaseModal
        open={modalOpen || Boolean(editing)}
        onClose={handleCloseModal}
        title={editing ? "Edit Product" : "Add New Product"}
        width={480}
      >
        <ProductForm
          token={token!}
          product={
            editing ? { ...editing, id: editing.id?.toString() } : editing
          }
          onSuccess={handleSuccess}
          onClose={handleCloseModal}
        />
      </BaseModal>
    </Container>
  );
}
