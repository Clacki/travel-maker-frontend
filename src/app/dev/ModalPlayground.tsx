'use client'

import { useState } from 'react'
import { Button } from '@/components/common/button'
import { Modal, type ModalSize } from '@/components/common/modal'
import { css } from '@/styled-system/css'

type ModalExample = 'basic' | 'footer' | ModalSize

const groupStyle = css({
  display: 'grid',
  gap: '5',
})

const rowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3',
})

const groupTitleStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
})

const contentStyle = css({
  display: 'grid',
  gap: '3',
  color: 'text.secondary',
})

export function ModalPlayground() {
  const [openExample, setOpenExample] = useState<ModalExample | null>(null)

  const closeModal = () => setOpenExample(null)

  return (
    <div className={groupStyle}>
      <div className={groupStyle}>
        <p className={groupTitleStyle}>Examples</p>
        <div className={rowStyle}>
          <Button onClick={() => setOpenExample('basic')}>기본 Modal</Button>
          <Button variant="secondary" onClick={() => setOpenExample('footer')}>
            footer Modal
          </Button>
        </div>
      </div>

      <div className={groupStyle}>
        <p className={groupTitleStyle}>Sizes</p>
        <div className={rowStyle}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Button
              key={size}
              variant="outline"
              onClick={() => setOpenExample(size)}
            >
              size {size}
            </Button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={openExample === 'basic'}
        onClose={closeModal}
        title="기본 모달"
      >
        <div className={contentStyle}>
          <p>여러 화면에서 공통으로 사용할 수 있는 기본 모달입니다.</p>
          <p>닫기 버튼, ESC 키, overlay 클릭으로 닫을 수 있습니다.</p>
        </div>
      </Modal>

      <Modal
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              취소
            </Button>
            <Button onClick={closeModal}>확인</Button>
          </>
        }
        isOpen={openExample === 'footer'}
        onClose={closeModal}
        title="footer가 있는 모달"
      >
        <p className={css({ color: 'text.secondary' })}>
          footer 영역은 확인, 취소 같은 액션 버튼을 배치하는 용도로 사용할 수
          있습니다.
        </p>
      </Modal>

      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Modal
          key={size}
          footer={<Button onClick={closeModal}>닫기</Button>}
          isOpen={openExample === size}
          onClose={closeModal}
          size={size}
          title={`size ${size}`}
        >
          <div className={contentStyle}>
            <p>
              {size === 'sm'
                ? '삭제 확인, 로그인처럼 작은 콘텐츠에 적합합니다.'
                : size === 'md'
                  ? '리뷰 작성/수정, 회원 탈퇴처럼 일반적인 폼 모달에 적합합니다.'
                  : '큰 콘텐츠가 들어가는 화면에 사용할 수 있는 크기입니다.'}
            </p>
            <p>
              모바일에서는 화면을 벗어나지 않도록 여백과 최대 높이를 제한합니다.
            </p>
          </div>
        </Modal>
      ))}
    </div>
  )
}
