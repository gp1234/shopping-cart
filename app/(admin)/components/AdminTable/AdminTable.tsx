"use client";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Typography, Paper, Button } from "@mui/material";
import type { Product } from "@/lib/data/products";

type Props = {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
};

export default function AdminTable({ products, onEdit, onDelete }: Props) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const columns = [
    { key: "id", label: "ID", width: 70 },
    { key: "name", label: "Name", flex: 1 },
    { key: "category", label: "Category", flex: 1 },
    { key: "price", label: "Price (€)", flex: 1 },
    { key: "description", label: "Description", flex: 3 },
    { key: "action", label: "Actions", width: 200 },
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
                <Typography
                  sx={{
                    width: 70,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.id}
                </Typography>
                <Typography sx={{ flex: 1 }}>{product.name}</Typography>
                <Typography sx={{ flex: 1 }}>{product.category}</Typography>
                <Typography sx={{ flex: 1 }}>{product.price}</Typography>
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
                  sx={{
                    width: 200,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onEdit?.(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete?.(product.id.toString())}
                  >
                    Delete
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
