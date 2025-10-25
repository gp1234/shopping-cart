'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store/userStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = useUserStore((s) => s.token)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setHasHydrated(true)
    })
    setHasHydrated(useUserStore.persist.hasHydrated())
    return unsub
  }, [])

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace('/login')
    }
  }, [token, hasHydrated, router])

  if (!hasHydrated) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        Loading session...
      </div>
    )
  }

  if (!token) return null

  return <>{children}</>
}
