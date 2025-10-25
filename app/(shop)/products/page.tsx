"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore } from "@/lib/store/userStore";
import ProductsTable from "@/components/Table/Table";
import type { Product } from "@/lib/data/products";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Slider,
  MenuItem,
} from "@mui/material";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ProductsData() {
  const token = useUserStore((state) => state.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const debouncedQuery = useDebounce(query, 300);

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
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [token]);

  const categories = useMemo(() => {
    const all = Array.from(new Set(products.map((product) => product.category)));
    return ["All", ...all];
  }, [products]);

const filtered = useMemo(() => {

  return products.filter((product) => {
    const matchesQuery =
      !debouncedQuery || product.name.toLowerCase().includes(debouncedQuery.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesQuery && matchesCategory && matchesPrice
  })
}, [products, debouncedQuery, category, priceRange])
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
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <TextField
          select
          label="Category"
          variant="outlined"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ width: 220 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Price Range (€)
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, v) => setPriceRange(v as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={200}
          />
        </Box>
      </Box>
      <ProductsTable products={filtered} />
    </>
  );
}
