import products from '@/public/data/products.json' assert { type: 'json' }
import ProductsTable from "@/components/Table/Table"
import type { Product } from '@/lib/data/products';
import { Container, Typography, CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default async function ProductsData() {
  const typedProducts: Product[] = (products as any[]).map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product["price (€)"],
    category: product.category
  }))

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Suspense fallback={<CircularProgress />}>
        <ProductsTable products={typedProducts} />
      </Suspense>
    </>
  );
}
