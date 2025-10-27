import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { Product } from "@/data/products";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Slider,
  MenuItem,
} from "@mui/material";

type Props = {
  products: Product[];
  setFiltered: (products: Product[]) => void;
};

export default function ProductFilter({ products, setFiltered }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultQuery = searchParams.get("q") || "";
  const defaultCategory = searchParams.get("category") || "All";
  const defaultMin = Number(searchParams.get("min") || 0);
  const defaultMax = Number(searchParams.get("max") || 500);

  const [query, setQuery] = useState(defaultQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [category, setCategory] = useState(defaultCategory);
  const [priceRange, setPriceRange] = useState<number[]>([
    defaultMin,
    defaultMax,
  ]);
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !debouncedQuery ||
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [products, debouncedQuery, category, priceRange]);

  const categories = useMemo(() => {
    const all = Array.from(
      new Set(products.map((product) => product.category))
    );
    return ["All", ...all];
  }, [products]);

  const minPrice = useMemo(() => {
    const all = Array.from(new Set(products.map((product) => product.price)));
    return Math.min(...all);
  }, [products]);

  const maxPrice = useMemo(() => {
    const all = Array.from(new Set(products.map((product) => product.price)));
    return Math.max(...all) + 100;
  }, [products]);
  useEffect(() => {
    setFiltered(filtered);
  }, [filtered, setFiltered]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "All") params.set("category", category);
    if (priceRange[0] !== 0) params.set("min", priceRange[0].toString());
    if (priceRange[1] !== 500) params.set("max", priceRange[1].toString());

    const queryString = params.toString();
    router.replace(`?${queryString}`, { scroll: false });
  }, [query, category, priceRange, router]);

  return (
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
          min={minPrice}
          max={maxPrice}
        />
      </Box>
    </Box>
  );
}
