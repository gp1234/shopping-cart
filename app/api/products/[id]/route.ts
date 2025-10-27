import { NextResponse } from "next/server";
import { decodeMockJWT } from "@/lib/utils/generateMockJWT";
import { dataStore } from "@/lib//utils/dataStore";

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
  { params }: { params: { id: string } }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const product = dataStore.products.find(
    (product) => product.id === Number(params.id)
  );
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const index = dataStore.products.findIndex((p) => p.id === Number(params.id));
  if (index === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  dataStore.products[index] = { ...dataStore.products[index], ...body };
  return NextResponse.json(dataStore.products[index]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = validateToken(req);
  if (auth instanceof NextResponse) return auth;

  const index = dataStore.products.findIndex((p) => p.id === Number(params.id));
  if (index === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const deleted = dataStore.products[index];
  dataStore.products.splice(index, 1);
  return NextResponse.json(deleted);
}
