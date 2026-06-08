'use client'

import { useState } from 'react'

import { Button } from '@/components/common/button'
import { ReviewModal } from '@/components/common/ReviewModal/ReviewModal'

export default function ReviewWriteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
        리뷰 쓰기
      </Button>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
        onSubmit={() => setIsModalOpen(false)}
      />
    </>
  )
}
