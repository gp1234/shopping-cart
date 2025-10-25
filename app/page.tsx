'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/userStore'

export default function HomeRedirect() {
  const router = useRouter()
  const token = useUserStore((s) => s.token)

  useEffect(() => {
    if (token) router.replace('/products')
    else router.replace('/login')
  }, [token, router])
  return null
}
