import { Suspense } from 'react'
import { AuthCallbackClient } from './AuthCallbackClient'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>카카오 로그인을 처리하고 있습니다.</div>}>
      <AuthCallbackClient />
    </Suspense>
  )
}
