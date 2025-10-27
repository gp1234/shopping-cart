import { NextResponse } from "next/server";
import { decodeMockJWT } from "@/server-utils/generateMockJWT";
import { dataStore } from "@/server-utils/dataStore";

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

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const product = dataStore.products.find(
    (product) => product.id === Number(id)
  );
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await context.params;
  const body = await req.json();
  const index = dataStore.products.findIndex(
    (product) => product.id === Number(id)
  );
  if (index === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  dataStore.products[index] = { ...dataStore.products[index], ...body };
  return NextResponse.json(dataStore.products[index]);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const index = dataStore.products.findIndex(
    (product) => product.id === Number(id)
  );
  if (index === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const deleted = dataStore.products[index];
  dataStore.products.splice(index, 1);
  return NextResponse.json(deleted);
}
