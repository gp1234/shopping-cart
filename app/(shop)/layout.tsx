import NavBar from "@/components/NavBar/NavBar";
import {Container} from "@mui/material";
export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{children}</Container>
    </>
  );
}
