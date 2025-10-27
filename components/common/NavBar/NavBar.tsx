"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoles } from "@/lib/data/users";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

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
          {pathname !== "/referral" && user?.role === UserRoles.USER && (
            <Button
              component={Link}
              href="/referral"
              color="secondary"
              variant="text"
              sx={{ ml: 2 }}
            >
              Make a referral
            </Button>
          )}
          {pathname !== "/checkout" && user?.role === UserRoles.USER && (
            <Button
              component={Link}
              href="/checkout"
              color="primary"
              variant="contained"
            >
              Checkout
            </Button>
          )}
          <Box>
            <Button onClick={handleLogout} variant="outlined">
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
