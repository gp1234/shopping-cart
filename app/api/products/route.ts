import { NextResponse } from "next/server";
import { decodeMockJWT } from "@/server-utils/generateMockJWT";
import { dataStore } from "@/server-utils/dataStore";
import { randomUUID } from "crypto";
import { ProductSchema } from "@/lib/schemas/productSchema";
import { z } from "zod";
function validateToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const decoded = decodeMockJWT(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return decoded;
}

export async function GET(req: Request) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({ products: dataStore.products });
}

export async function POST(req: Request) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const validation = ProductSchema.safeParse(body);
  if (!validation.success) {
    const formatted = validation.error.flatten();
    return NextResponse.json({ error: formatted }, { status: 400 });
  }

  const newProduct = { id: randomUUID(), ...body };
  dataStore.products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
