import { NextResponse } from "next/server";
import { decodeMockJWT } from "@/lib/utils/generateMockJWT";
import { dataStore } from "@/lib//utils/dataStore";
import { randomUUID } from "crypto";
import { ProductSchema } from "@/lib/schemas/productSchema";

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
    return NextResponse.json(
      { error: validation.error.format() },
      { status: 400 }
    );
  }

  const newProduct = { id: randomUUID(), ...body };
  dataStore.products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
