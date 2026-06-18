'use client'

import { useState } from 'react'
import { WithdrawModal } from '@/components/common/WithdrawModal'
import { Button } from '@/components/common/button'

export function WithdrawModalPlayground() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="neutral" onClick={() => setIsOpen(true)}>
        회원 탈퇴
      </Button>

      <WithdrawModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onWithdraw={async (reason) => console.log('withdraw', reason)}
      />
    </>
  )
}
