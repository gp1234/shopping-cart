"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductFormData } from "@/lib/schemas/productSchema";

interface ProductFormProps {
  token: string;
  product?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    category?: string;
  } | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ProductForm({
  token,
  product,
  onSuccess,
  onClose,
}: ProductFormProps) {
  const isEditing = Boolean(product);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category || "",
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        category: "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setServerError(null);
    setLoading(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/products/${product?.id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to save product");
      }

      onSuccess?.();
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="subtitle1" textAlign="center">
        {isEditing ? "Edit Product" : "Add New Product"}
      </Typography>

      <TextField
        label="Name"
        fullWidth
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={2}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />

      <TextField
        label="Price (€)"
        fullWidth
        type="number"
        {...register("price", { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
      />

      <TextField
        label="Category"
        fullWidth
        {...register("category")}
        error={!!errors.category}
        helperText={errors.category?.message}
      />

      {serverError && (
        <Typography variant="body2" color="error">
          {serverError}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={22} color="inherit" />
        ) : isEditing ? (
          "Save Changes"
        ) : (
          "Add Product"
        )}
      </Button>

      <Button
        variant="text"
        color="inherit"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
    </Box>
  );
}
