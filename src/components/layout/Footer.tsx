import type { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { ROUTES } from '@/constants/routes'
import { css, cx } from '@/styled-system/css'

const footerColumns = [
  {
    title: '서비스',
    links: [
      { href: ROUTES.TEST, label: '여행 스타일 진단' },
      { href: ROUTES.EXPLORE, label: '여행지 탐색' },
      { href: ROUTES.TEST_RESULT, label: '맞춤 추천' },
      { href: '#reviews', label: '여행 후기' },
    ],
  },
  {
    title: '고객지원',
    links: [
      { href: '#notice', label: '공지사항' },
      { href: '#faq', label: '자주 묻는 질문' },
      { href: '#contact', label: '1:1 문의' },
      { href: '#partnership', label: '제휴 문의' },
    ],
  },
] as const

const policyLinks = [
  '서비스 이용약관',
  '위치기반서비스 이용약관',
  '청소년보호정책',
  '사업자정보확인',
] as const

const footerStyle = css({
  bg: 'bg.surface',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
})

const footerInnerStyle = css({
  py: { base: '8', md: '10' },
})

const footerGridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: '1.4fr repeat(3, minmax(0, 1fr))',
  },
  gap: { base: '6', md: '8' },
})

const footerLogoStyle = css({
  display: 'inline-flex',
  color: 'primary',
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: 'tight',
  mb: '3',
  borderRadius: 'sm',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const footerDescriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
  maxW: '320px',
})

const contactListStyle = css({
  display: 'grid',
  gap: '2',
  color: 'text.secondary',
  fontSize: 'sm',
  fontStyle: 'normal',
  lineHeight: 'normal',
})

const footerBottomStyle = css({
  mt: { base: '8', md: '10' },
  pt: '6',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
  display: 'grid',
  gap: '4',
})

const businessInfoStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
  lineHeight: 'relaxed',
})

const footerBottomMetaStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
})

const policyNavStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: { base: '2', md: '4' },
})

const footerListStyle = css({
  display: 'grid',
  gap: '2',
  listStyle: 'none',
  m: 0,
  p: 0,
})

const footerLinkStyle = css({
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'medium',
  borderRadius: 'xs',
  transitionProperty: 'color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const policyLinkStyle = css({
  color: 'text.primary',
  fontSize: 'xs',
  fontWeight: 'medium',
  borderRadius: 'xs',
  transitionProperty: 'color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const copyrightStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
})

const footerTitleStyle = css({
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  mb: '3',
})

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cx(footerStyle, className)}>
      <LayoutContainer className={footerInnerStyle}>
        <div className={footerGridStyle}>
          <div>
            <Link href={ROUTES.HOME} className={footerLogoStyle}>
              TravelMaker
            </Link>
            <p className={footerDescriptionStyle}>
              여행 취향을 이해하고, 나에게 맞는 국내 여행지를 더 쉽게 발견하도록
              돕는 서비스입니다.
            </p>
          </div>

          {footerColumns.map((column) => (
            <FooterLinkColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}

          <div>
            <FooterTitle>Contact</FooterTitle>
            <address className={contactListStyle}>
              <span>전화번호: 0000-0000</span>
              <span>이메일: contact@travelmaker.example</span>
              <span>주소: 서울특별시 여행구 메이커로 00</span>
              <span>운영시간: 평일 10:00 - 18:00</span>
            </address>
          </div>
        </div>

        <div className={footerBottomStyle}>
          <p className={businessInfoStyle}>
            사업자 정보: TravelMaker Inc. | 대표자: 홍길동 | 사업자등록번호:
            000-00-00000 | 통신판매업 신고번호: 제2026-서울여행-0000호
          </p>

          <div className={footerBottomMetaStyle}>
            <nav aria-label="정책 링크" className={policyNavStyle}>
              {policyLinks.map((label) => (
                <Link key={label} href="#policy" className={policyLinkStyle}>
                  {label}
                </Link>
              ))}
            </nav>
            <p className={copyrightStyle}>
              Copyright 2026 TravelMaker. All rights reserved.
            </p>
          </div>
        </div>
      </LayoutContainer>
    </footer>
  )
}

interface FooterLinkColumnProps {
  title: string
  links: readonly { href: string; label: string }[]
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className={footerListStyle}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={footerLinkStyle}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FooterTitleProps {
  children: ReactNode
}

function FooterTitle({ children }: FooterTitleProps) {
  return <h2 className={footerTitleStyle}>{children}</h2>
}
