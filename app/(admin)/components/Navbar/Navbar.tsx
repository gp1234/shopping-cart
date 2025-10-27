"use client";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Shop
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={handleLogout} variant="outlined">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
