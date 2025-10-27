import NavBar from "@/components/common/NavBar/NavBar";
import { Container } from "@mui/material";
import ProtectedRoute from "@/components/common/ProtectedRoute/ProtectedRoute";
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </ProtectedRoute>
  );
}
