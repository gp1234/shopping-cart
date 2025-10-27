import Navbar from "@/components/NavBar/NavBar";
import { Container } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </ProtectedRoute>
  );
}
