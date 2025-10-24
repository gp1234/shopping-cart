import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function NavBar({ children }: { children: React.ReactNode }) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Shop
        </Typography>
        <Box>{children}</Box>
      </Toolbar>
    </AppBar>
  );
}
