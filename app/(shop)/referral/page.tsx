"use client";

import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import { z } from "zod";
import { useUserStore } from "@/lib/store/userStore";
import { generateURL } from "@/lib/utils/generateURL";
import { BaseModal } from "@/components/common/Modal/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",

  p: 4,
};

const ReferralSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." }),
});

export default function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = ReferralSchema.safeParse({ email });

    if (!result.success) {
      const firstError = result.error?.issues?.[0]?.message || "Invalid input";
      setError(firstError);
      return;
    }

    setReferralLink(generateURL(user!.id, email));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReferralLink(null);
    setEmail("");
  };
  return (
    <>
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
      <BaseModal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Referral Link"
      >
        <Typography sx={{ mb: 2 }}>{referralLink}</Typography>
        <Button variant="contained" color="primary" onClick={handleCloseModal}>
          Done
        </Button>
      </BaseModal>
    </>
  );
}
