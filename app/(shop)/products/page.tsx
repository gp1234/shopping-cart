"use client";

import { useEffect, useState } from "react";
import VirtualizedTable from "@/components/VirtualizedTable/VirtualizedTable";
import type { Product } from "@/data/products";
import ProductFilter from "@/components/ProductFilter/ProductFilter";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import { useCartStore } from "@/lib/store/productStore";
import { useProducts } from "@/lib/hooks/useProducts";

export default function ProductsData() {
  const { products, loading, error } = useProducts();
  const [filtered, setFiltered] = useState<Product[]>([]);

  const items = useCartStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const columns = [
    { key: "id", label: "ID", width: 70, hideOnMobile: true },
    { key: "name", label: "Name", flex: 2 },
    { key: "category", label: "Category", flex: 1, hideOnMobile: true },
    { key: "price", label: "Price (€)", width: { xs: "auto", sm: 120 } },
    { key: "description", label: "Description", flex: 3, hideOnMobile: true },
  ];

  useEffect(() => {
    setFiltered(products);
  }, [products]);

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
      <VirtualizedTable
        data={filtered}
        columns={columns}
        renderActions={(product) => {
          const inCart = items.some((item) => item.id === product.id);
          return (
            <Button
              variant={inCart ? "outlined" : "contained"}
              color={inCart ? "secondary" : "primary"}
              size="small"
              onClick={() =>
                inCart ? removeFromCart(product.id) : addToCart(product)
              }
            >
              {inCart ? "Remove" : "Buy"}
            </Button>
          );
        }}
      />
    </>
  );
}
