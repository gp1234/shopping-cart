import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );
  res.cookies.set("jwt", "", { path: "/", maxAge: 0 });
  return res;
}
