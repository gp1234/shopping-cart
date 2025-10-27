import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is too short"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(2, "Category is required"),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
