import { test, expect, type Page } from "@playwright/test";

const mockProducts = [
  {
    id: 1,
    name: "Soft Belt",
    category: "Casualwear",
    price: 410.27,
    description:
      "The soft belt is made from high-quality polyester and adds sophistication to any look.",
  },
  {
    id: 2,
    name: "Relaxed Sweater",
    category: "Sportswear",
    price: 18.93,
    description:
      "The relaxed sweater is made from high-quality velvet and lightweight yet durable.",
  },
  {
    id: 3,
    name: "Tailored Sandals",
    category: "Formalwear",
    price: 169.07,
    description:
      "The tailored sandals is made from high-quality polyester and blends elegance with simplicity.",
  },
];

type MockLoginOptions = {
  email: string;
  role: "user" | "admin";
};

async function mockLoginAndProducts(page: Page, options: MockLoginOptions) {
  const token = options.role === "admin" ? "mock-admin-token" : "mock-user-token";
  const user =
    options.role === "admin"
      ? {
          id: "2",
          email: options.email,
          role: "admin",
          tier: 1,
        }
      : {
          id: "1",
          email: options.email,
          role: "user",
          tier: 3,
        };

  await page.route("**/api/auth/login", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Login successful",
        user,
        token,
      }),
    });
  });

  await page.route("**/api/products", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ products: mockProducts }),
    });
  });
}

async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

test.describe("Frontend flows", () => {
  test("customer logs in and views products", async ({ page }) => {
    await mockLoginAndProducts(page, { email: "gio@example.com", role: "user" });
    await login(page, "gio@example.com", "password123");

    await page.waitForURL("**/products", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible();

    const firstProduct = page.getByText("Soft Belt").first();
    await expect(firstProduct).toBeVisible();

    const searchInput = page.getByRole("textbox", { name: /search/i });
    await searchInput.fill("Sweater");
    const filteredProduct = page.getByText("Relaxed Sweater").first();
    await expect(filteredProduct).toBeVisible({
      timeout: 5_000,
    });
  });

  test("admin is redirected to dashboard", async ({ page }) => {
    await mockLoginAndProducts(page, {
      email: "admin@example.com",
      role: "admin",
    });
    await login(page, "admin@example.com", "password123");

    await page.waitForURL("**/dashboard", { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Product Management" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Product" })).toBeVisible();
  });
});
