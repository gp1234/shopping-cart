import { z } from "zod";

export const LoginSchema = z.object({
email: z.string().trim().pipe(z.email({ message: 'Invalid email address' })),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const signupSchema = z
  .object({
  email: z.string().trim().pipe(z.email({ message: 'Invalid email address' })),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    invitedBy: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
