import Link from 'next/link'

import { css } from '@/styled-system/css'

interface BreadcrumbProps {
  placeName: string
}

const containerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'sm',
  color: 'text.secondary',
})

const separatorStyle = css({
  color: 'border',
  userSelect: 'none',
})

const homeLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  color: 'text.secondary',
  _hover: { color: 'primary' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
})

export default function Breadcrumb({ placeName }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={containerStyle}>
      <Link href="/" aria-label="홈으로 이동" className={homeLinkStyle}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      <span aria-hidden="true" className={separatorStyle}>
        ›
      </span>
      <Link href="/explore" className={homeLinkStyle}>
        여행지 탐색
      </Link>
      <span aria-hidden="true" className={separatorStyle}>
        ›
      </span>
      <span aria-current="page">{placeName}</span>
    </nav>
  )
}
