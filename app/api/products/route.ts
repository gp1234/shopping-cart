import { NextResponse } from 'next/server'
import { decodeMockJWT } from '@/lib/utils/generateMockJWT'
import products from '@/public/data/products.json' assert { type: 'json' }

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 })
  }

  const decoded = decodeMockJWT(token)
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }


  return NextResponse.json({ products })
}
