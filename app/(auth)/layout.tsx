"use client";
import { Box, Container, Card, CardContent, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component={"section"}
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: blueGrey[50],
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
