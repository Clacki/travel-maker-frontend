'use client'

import { useState } from 'react'
import { ReviewModal } from '@/components/common/ReviewModal'
import type { ReviewModalMode } from '@/components/common/ReviewModal'
import { Button } from '@/components/common/button'
import { css } from '@/styled-system/css'

export function ReviewModalPlayground() {
  const [mode, setMode] = useState<ReviewModalMode>('create')
  const [isOpen, setIsOpen] = useState(false)

  const openModal = (selectedMode: ReviewModalMode) => {
    setMode(selectedMode)
    setIsOpen(true)
  }

  return (
    <div className={css({ display: 'flex', gap: '3', flexWrap: 'wrap' })}>
      <Button variant="primary" onClick={() => openModal('create')}>
        리뷰 작성
      </Button>
      <Button variant="secondary" onClick={() => openModal('edit')}>
        리뷰 수정
      </Button>
      <Button variant="neutral" onClick={() => openModal('delete')}>
        리뷰 삭제
      </Button>

      <ReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
        initialRating={mode === 'edit' ? 4 : 0}
        initialContent={
          mode === 'edit'
            ? '정말 아름다운 곳이었어요. 다음에 또 가고 싶네요!'
            : ''
        }
        onSubmit={(rating, content) => {
          console.log('submit', rating, content)
          setIsOpen(false)
        }}
        onDelete={() => console.log('delete')}
      />
    </div>
  )
}
