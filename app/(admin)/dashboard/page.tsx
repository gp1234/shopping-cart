"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import type { Product } from "@/data/products";
import { BaseModal } from "@/components/Modal/Modal";
import { ProductForm } from "../components/ProductForm/ProductForm";
import ProductFilter from "@/components/ProductFilter/ProductFilter";
import VirtualizedBaseTable from "@/components/VirtualizedTable/VirtualizedTable";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useProducts } from "@/lib/hooks/useProducts";

export default function AdminDashboard() {
  const token = useUserStore((state) => state.token);
  const { products, loading, error, refetch } = useProducts();
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  useEffect(() => {
    setFiltered(products);
  }, [products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      refetch().catch((err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuccess = () => {
    refetch().catch((err) => {
      console.error(err);
    });
    handleCloseModal();
  };

  const columns = [
    { key: "id", label: "ID", width: 70, hideOnMobile: true },
    { key: "name", label: "Name", flex: 1 },
    { key: "category", label: "Category", flex: 1, hideOnMobile: true },
    { key: "price", label: "Price (€)", flex: 1, hideOnMobile: true },
    { key: "description", label: "Description", flex: 3, hideOnMobile: true },
  ];

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
    <Container sx={{ py: 4, px: 0 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
          mb: { xs: 1, md: 2 },
        }}
      >
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
      <VirtualizedBaseTable
        data={filtered}
        columns={columns}
        height={600}
        renderActions={(product) => (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setEditing(product)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(product.id.toString())}
            >
              Delete
            </Button>
          </>
        )}
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
