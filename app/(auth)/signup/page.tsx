"use client";

import { z } from "zod";
import { useEffect } from "react";
import { signupSchema } from "@/lib/schemas/authSchema";
import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  CardHeader,
  CardContent,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { useSearchParams } from "next/navigation";

type SignUpFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const token = useUserStore((s) => s.token);
  const searchParams = useSearchParams();
  const invitedBy = searchParams.get("referral");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (email) {
      setValue("email", decodeURIComponent(email), {
        shouldDirty: false,
        shouldTouch: true,
      });
    }
  }, [email, setValue]);

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  const onSubmit = async (data: SignUpFormData) => {
    clearErrors();
    const res = await fetch("/api/users/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invitedBy ? { ...data, invitedBy } : data),
    });
    const result = await res.json();
    if (!res.ok) {
      if (result.errors) {
        result.errors.forEach(
          (error: { field: keyof SignUpFormData; message: string }) => {
            setError(error.field, { message: error.message });
          }
        );
      } else if (result.error) {
        setError("root", { message: result.error });
      }
      return;
    }
    useUserStore.getState().login(result.user, result.token);
    router.push("/");
  };

  const emailValue = watch("email");

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
      <CardHeader
        title={
          <Typography fontWeight={"bold"} variant="h4">
            Sign Up
          </Typography>
        }
      />
      <CardContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: Boolean(emailValue) }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          {errors.root && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.root.message}
            </Typography>
          )}

          <Box
            component="footer"
            mt={2}
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              sx={{ ml: 1 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
