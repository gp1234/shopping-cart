"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoles } from "@/data/users";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {pathname !== "/referral" && user?.role === UserRoles.USER && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/referral"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Make a referral" />
            </ListItemButton>
          </ListItem>
        )}
        {pathname !== "/checkout" && user?.role === UserRoles.USER && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Checkout" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <>
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

          {isMobile ? (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          ) : (
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
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
    </>
  );
}
