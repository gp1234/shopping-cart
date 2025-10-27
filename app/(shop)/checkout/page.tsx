"use client";
import { Typography, Box, Button } from "@mui/material";

import { useCartStore } from "@/lib/store/productStore";
import { useUserStore } from "@/lib/store/userStore";

const getDiscount = (tier: number) => {
  switch (tier) {
    case 1:
      return 0;
    case 2:
      return 0.2;
    case 3:
      return 0.3;
  }
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.products);

  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const user = useUserStore((state) => state.user);
  const discount = getDiscount(user?.tier ? Number(user.tier) : 1) || 0;
  const subtotal = items.reduce((total, item) => {
    const price = Number((item as any).price ?? (item as any).unitPrice ?? 0);
    return total + price;
  }, 0);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  if (!hasHydrated) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Box component="section">
          <Box role="table" sx={{ width: "100%" }}></Box>
          <Box role="rowgroup">
            <Box
              role="row"
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 2,
                px: 1,
                py: 1,
                bgcolor: "grey.100",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2">Product</Typography>
              <Typography variant="subtitle2">Price</Typography>
              <Typography
                sx={{ textAlign: { sm: "right" } }}
                variant="subtitle2"
              >
                Action
              </Typography>
            </Box>
          </Box>
          <Box role="rowgroup">
            {items.map((item, index) => {
              const id = (item as any).id ?? index;
              const name =
                (item as any).name ?? (item as any).title ?? "Product";
              const price = Number(
                (item as any).price ?? (item as any).unitPrice ?? 0
              );

              return (
                <Box
                  key={id}
                  role="row"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 2,
                    alignItems: "center",
                    py: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box role="cell" sx={{ px: 1 }}>
                    <Typography variant="subtitle2">{name}</Typography>
                  </Box>

                  <Box role="cell">
                    <Typography>${price.toFixed(2)}</Typography>
                  </Box>
                  <Box role="cell" sx={{ marginLeft: { sm: "auto" } }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeFromCart(id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              );
            })}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Box sx={{ mb: 2, textAlign: "right" }}>
                <Typography fontWeight={"Bold"}>Discount</Typography>
                <Typography>€{(discount * subtotal).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography fontWeight={"Bold"}>Total</Typography>
                <Typography>
                  €{(subtotal - discount * subtotal).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
