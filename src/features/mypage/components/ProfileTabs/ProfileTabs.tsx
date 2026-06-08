'use client'

import { css } from '@/styled-system/css'

// ─── Types ────────────────────────────────────────────────

export type TabType = 'bookmark' | 'review' | 'test'

interface ProfileTabsProps {
  isMyProfile: boolean
  bookmarkCount: number
  reviewCount: number
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

// ─── Styles ────────────────────────────────────────────────

const tabListStyle = css({
  display: 'flex',
  borderBottomWidth: '1px',
  borderColor: 'border.subtle',
})

const tabButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  px: '4',
  py: '3',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.secondary',
  bg: 'transparent',
  border: 'none',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  cursor: 'pointer',
  transitionProperty: 'color, border-color',
  transitionDuration: '150ms',
  _hover: {
    color: 'text.primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const activeTabStyle = css({
  color: 'primary',
  borderBottomColor: 'primary',
})

const tabCountStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const activeTabCountStyle = css({
  color: 'primary',
})

// ─── Component ────────────────────────────────────────────

export function ProfileTabs({
  isMyProfile,
  bookmarkCount,
  reviewCount,
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  const tabs = isMyProfile
    ? [
        {
          id: 'bookmark' as TabType,
          label: '찜 목록',
          count: bookmarkCount,
          icon: <BookmarkIcon />,
        },
        {
          id: 'review' as TabType,
          label: '리뷰',
          count: reviewCount,
          icon: <ReviewIcon />,
        },
        {
          id: 'test' as TabType,
          label: '성향 테스트 결과',
          count: null,
          icon: <TestIcon />,
        },
      ]
    : [
        {
          id: 'bookmark' as TabType,
          label: '찜 목록',
          count: bookmarkCount,
          icon: <BookmarkIcon />,
        },
      ]

  return (
    <div role="tablist" className={tabListStyle}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${tabButtonStyle} ${isActive ? activeTabStyle : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== null && (
              <span
                className={`${tabCountStyle} ${isActive ? activeTabCountStyle : ''}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────

function BookmarkIcon() {
  return (
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function ReviewIcon() {
  return (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function TestIcon() {
  return (
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
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  )
}
