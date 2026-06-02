'use client'

import { useRouter } from 'next/navigation'

export function LoginButton() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push('/?showLogin=true')
  }

  return (
    <button type="button" onClick={handleLoginClick}>
      로그인
    </button>
  )
}
