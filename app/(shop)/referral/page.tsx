"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { z } from "zod";
import { useUserStore } from "@/lib/store/userStore";

const ReferralSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." }),
});

export default function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  console.log("Current user:", user);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = ReferralSchema.safeParse({ email });

    if (!result.success) {
      const firstError = result.error?.issues?.[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }
    
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" component="h1" gutterBottom>
          Referral
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
            fullWidth
            margin="normal"
            autoComplete="email"
            error={!!error}
            helperText={error ?? "Enter the recipient email"}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Send Referral
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
