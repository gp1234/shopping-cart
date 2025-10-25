import { NextResponse } from 'next/server'
import { users } from '@/lib/data/users'
import { LoginSchema } from '@/lib/schemas/authSchema'
import { generateMockJWT } from '@/lib/utils/generateMockJWT'

export async function POST(request: Request) {
  const body = await request.json()
  const result = LoginSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      { status: 400 }
    )
  }

  const { email, password } = result.data
  const existingUser = users.find(
    (u) => u.email === email && u.password === password
  )

  if (!existingUser)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = generateMockJWT({
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    tier: existingUser.tier,
  })

  return NextResponse.json({
    message: 'Login successful',
    user: existingUser,
    token,
  })
}
