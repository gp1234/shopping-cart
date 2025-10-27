"use client";
import { useEffect } from "react";
import { z } from "zod";
import { LoginSchema } from "@/lib/schemas/authSchema";
import {
  TextField,
  Button,
  Card,
  Typography,
  Container,
  Box,
  CardHeader,
  CardContent,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LogInPage() {
  const router = useRouter();
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok) {
      if (result.errors) {
        result.errors.forEach(
          (error: { field: keyof LoginFormData; message: string }) => {
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

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 2, padding: 2 }}>
      <CardHeader
        title={
          <Typography fontWeight={"bold"} variant="h4">
            Login
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
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            <Button
              sx={{ ml: 1 }}
              variant="outlined"
              color="primary"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
