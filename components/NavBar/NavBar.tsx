"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link"
 import { usePathname } from 'next/navigation';

export default function NavBar() {
    const pathname = usePathname()
    return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography  variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Shop
        </Typography>
        <Box>
          {pathname !== '/referral' && (
            <Button component={Link} href="/referral" color="secondary" variant="text" sx={{ ml: 2 }}>
              Make a referral
            </Button>
          )}
          {pathname !== '/checkout' && (
            <Button component={Link} href="/checkout" color="primary" variant="contained">
              Checkout
            </Button>
          )}
        </Box>
 
      </Toolbar>
    </AppBar>
  );
}
