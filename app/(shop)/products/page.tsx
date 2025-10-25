
"use client";

import {useEffect, useState} from "react";
import { useUserStore } from "@/lib/store/userStore";
import ProductsTable from "@/components/Table/Table"
import type { Product } from '@/lib/data/products';
import { Container, Typography, CircularProgress } from "@mui/material";


export default  function ProductsData() {
  const token = useUserStore((state) => state.token)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load products')
        }

        setProducts(data.products)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [token])

  if (loading)
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )

  if (error)
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    )

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
        <ProductsTable products={products} />
 
    </>
  );
}
