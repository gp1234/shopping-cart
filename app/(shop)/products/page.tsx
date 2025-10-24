import { Typography, Container, CircularProgress } from "@mui/material";

export default async function ProductsPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
    </Container>
  );
}

async function ProductsData() {
  const res = await fetch("/api/products", {
    cache: "no-store",
  });
}
