"use client";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Typography, Paper, Button } from "@mui/material";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/productStore";

type Props = {
  products: Product[];
};

export default function VirtualizedProductTable({ products }: Props) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const items = useCartStore((state) => state.products);
  const toggleCartItem = useCartStore((state) => state.toggleCartItem);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const columns = [
    { key: "id", label: "ID", width: 70 },
    { key: "name", label: "Name", flex: 2 },
    { key: "category", label: "Category", flex: 1 },
    { key: "price", label: "Price (€)", width: 120 },
    { key: "description", label: "Description", flex: 3 },
    { key: "action", label: "Actions", width: 100 },
  ];

  return (
    <Paper
      sx={{
        height: 600,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#fafafa",
          fontWeight: 600,
          px: 2,
        }}
      >
        {columns.map((col) => (
          <Typography
            key={col.key}
            sx={{
              width: col.width || "auto",
              flex: col.flex || "none",
              py: 1.5,
            }}
          >
            {col.label}
          </Typography>
        ))}
      </Box>

      <Box
        ref={parentRef}
        sx={{ flex: 1, overflow: "auto", position: "relative" }}
      >
        <Box
          sx={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const product = products[virtualRow.index];
            const inCart = items.some((i) => i.id === product.id);

            return (
              <Box
                key={virtualRow.key}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  px: 2,
                }}
              >
                <Typography sx={{ width: 70 }}>{product.id}</Typography>
                <Typography sx={{ flex: 2 }}>{product.name}</Typography>
                <Typography sx={{ flex: 1 }}>{product.category}</Typography>
                <Typography sx={{ width: 120 }}>{product.price}</Typography>
                <Typography
                  sx={{
                    flex: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.description}
                </Typography>

                <Box
                  sx={{ width: 100, display: "flex", justifyContent: "center" }}
                >
                  <Button
                    variant={inCart ? "outlined" : "contained"}
                    color={inCart ? "secondary" : "primary"}
                    size="small"
                    onClick={() => toggleCartItem(product)}
                  >
                    {inCart ? "Remove" : "Buy"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
