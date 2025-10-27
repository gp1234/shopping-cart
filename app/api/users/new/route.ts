import { NextResponse } from "next/server";
import { users } from "@/data/users";
import { randomUUID } from "crypto";
import { signupSchema } from "@/lib/schemas/authSchema";
import { User } from "@/data/users";
import { generateMockJWT } from "@/server-utils/generateMockJWT";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);
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

    const { email, password, invitedBy } = result.data as {
      email: string;
      password: string;
      invitedBy?: string;
    };

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    let tier = 1;

    if (invitedBy) {
      const invited = users.find((user) => user.id === invitedBy);
      if (invited) {
        tier = invited.tier as number;
      }
    }

    const newUser: User = {
      id: randomUUID(),
      email,
      password,
      tier,
      role: "user",
    };

    users.push(newUser);

    const token = generateMockJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      tier: newUser.tier,
      exp: Date.now() + 1000 * 60 * 60,
    });
    const res = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          tier: newUser.tier,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
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
