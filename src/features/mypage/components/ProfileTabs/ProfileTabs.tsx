'use client'

import { Heart, FileText, BarChart3, Map } from 'lucide-react'
import { css } from '@/styled-system/css'

export type TabType = 'bookmark' | 'review' | 'trip' | 'test'

interface ProfileTabsProps {
  isMyProfile: boolean
  bookmarkCount: number
  reviewCount: number
  tripCount?: number
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

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

export function ProfileTabs({
  isMyProfile,
  bookmarkCount,
  reviewCount,
  tripCount = 0,
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  const tabs = isMyProfile
    ? [
        {
          id: 'bookmark' as TabType,
          label: '찜 목록',
          count: bookmarkCount,
          icon: <Heart size={16} />,
        },
        {
          id: 'review' as TabType,
          label: '리뷰',
          count: reviewCount,
          icon: <FileText size={16} />,
        },
        {
          id: 'trip' as TabType,
          label: '내 여행코스',
          count: tripCount,
          icon: <Map size={16} />,
        },
        {
          id: 'test' as TabType,
          label: '성향 테스트 결과',
          count: null,
          icon: <BarChart3 size={16} />,
        },
      ]
    : [
        {
          id: 'bookmark' as TabType,
          label: '찜 목록',
          count: bookmarkCount,
          icon: <Heart size={16} />,
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
