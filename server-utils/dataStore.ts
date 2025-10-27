import products from "@/public/data/products.json" assert { type: "json" };

export const dataStore = {
  products: [...products],
};
