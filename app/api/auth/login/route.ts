import { NextResponse } from "next/server";
import { users } from "@/lib/data/users";
import { LoginSchema } from "@/lib/schemas/authSchema";
import { generateMockJWT } from "@/lib/utils/generateMockJWT";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          errors: result.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }
    const { email, password } = result.data;

    const existingUser = users.find(
      (user) => user.email === email && user.password === password
    );
    if (!existingUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateMockJWT({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      tier: existingUser.tier,
    });
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          tier: existingUser.tier,
          role: existingUser.role,
        },
      },
      { status: 200 }
    );

    res.cookies.set("jwt", token, { httpOnly: false, path: "/" });
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
