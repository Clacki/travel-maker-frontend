import { Suspense } from 'react'
import { SocialCallbackClient } from './SocialCallbackClient'

export default function SocialCallbackPage() {
  return (
    <Suspense fallback={<div>카카오 로그인을 처리하고 있습니다.</div>}>
      <SocialCallbackClient />
    </Suspense>
  )
}
