'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { Modal } from '@/components/common/modal'
import { Button } from '@/components/common/button'

// ─── Types ────────────────────────────────────────────────

type WithdrawReason = '서비스 불만족' | '개인정보 우려' | '기타'

export interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onWithdraw: (reason: WithdrawReason) => void
}

// ─── Styles ────────────────────────────────────────────────

const descriptionStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
  mb: '4',
})

const radioGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const radioLabelStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  cursor: 'pointer',
  fontSize: 'md',
  color: 'text.primary',
})

const radioInputStyle = css({
  width: '4',
  height: '4',
  accentColor: '#2CA6BE',
  cursor: 'pointer',
  flexShrink: 0,
})

const confirmTextStyle = css({
  fontSize: 'md',
  color: 'text.primary',
  lineHeight: 'normal',
  textAlign: 'center',
  py: '2',
})

const cautionTextStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
  textAlign: 'center',
  mt: '2',
})

const footerRowStyle = css({
  display: 'flex',
  gap: '3',
  width: 'full',
})

const withdrawButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  minH: '10',
  px: '5',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'warning',
  borderRadius: 'pill',
  bg: 'warning',
  color: 'text.inverse',
  fontSize: 'md',
  fontWeight: 'semibold',
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color',
  transitionDuration: '150ms',
  _hover: {
    opacity: '0.9',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const WITHDRAW_REASONS: WithdrawReason[] = [
  '서비스 불만족',
  '개인정보 우려',
  '기타',
]

// ─── Component ────────────────────────────────────────────

export function WithdrawModal({
  isOpen,
  onClose,
  onWithdraw,
}: WithdrawModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [reason, setReason] = useState<WithdrawReason>('서비스 불만족')

  const handleClose = () => {
    setStep(1)
    setReason('서비스 불만족')
    onClose()
  }

  const handleWithdraw = () => {
    onWithdraw(reason)
    handleClose()
  }

  if (step === 1) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="회원 탈퇴"
        size="sm"
        footer={
          <div className={footerRowStyle}>
            <Button
              variant="neutral"
              shape="pill"
              fullWidth
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              variant="primary"
              shape="pill"
              fullWidth
              onClick={() => setStep(2)}
            >
              다음
            </Button>
          </div>
        }
      >
        <p className={descriptionStyle}>탈퇴 사유를 선택해주세요.</p>
        <div className={radioGroupStyle}>
          {WITHDRAW_REASONS.map((r) => (
            <label key={r} className={radioLabelStyle}>
              <input
                type="radio"
                name="withdraw-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className={radioInputStyle}
              />
              {r}
            </label>
          ))}
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="회원 탈퇴"
      size="sm"
      footer={
        <div className={footerRowStyle}>
          <Button
            variant="neutral"
            shape="pill"
            fullWidth
            onClick={() => setStep(1)}
          >
            취소
          </Button>
          <button
            type="button"
            className={withdrawButtonStyle}
            onClick={handleWithdraw}
          >
            탈퇴하기
          </button>
        </div>
      }
    >
      <p className={confirmTextStyle}>정말 탈퇴하시겠습니까?</p>
      <p className={cautionTextStyle}>
        14일 이내 재로그인 시 계정을 복구할 수 있습니다.
      </p>
    </Modal>
  )
}
