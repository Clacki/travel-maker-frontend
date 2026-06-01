'use client'

import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { css } from '@/styled-system/css'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <header
      className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        bg: 'white',
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: 6,
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        <Link href="/" className={css({ textDecoration: 'none' })}>
          <span
            className={css({
              fontSize: '2xl',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              background:
                'linear-gradient(135deg, var(--colors-primary) 0%, var(--colors-accent) 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            })}
          >
            TravelMaker
          </span>
        </Link>

        <nav
          className={css({
            display: { base: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 8,
          })}
        >
          {['홈', '인기 여행지', '여행 팁'].map((item) => (
            <Link
              key={item}
              href="/"
              className={css({
                fontSize: 'sm',
                color: 'muted.foreground',
                textDecoration: 'none',
                _hover: { color: 'foreground' },
                transitionProperty: 'background-color, color, border-color',
                transitionDuration: '200ms',
                transitionTimingFunction: 'ease-in-out',
              })}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className={css({ display: 'flex', alignItems: 'center', gap: 3 })}>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={css({
                w: 10,
                h: 10,
                rounded: 'lg',
                bg: 'secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                _hover: { bg: 'secondary/80' },
                transitionProperty: 'background-color, color, border-color',
                transitionDuration: '200ms',
                transitionTimingFunction: 'ease-in-out',
              })}
              aria-label="테마 변경"
            >
              {theme === 'dark' ? (
                <Sun className={css({ w: 5, h: 5, color: 'foreground' })} />
              ) : (
                <Moon className={css({ w: 5, h: 5, color: 'foreground' })} />
              )}
            </button>
          )}
          <button
            className={css({
              px: 4,
              py: 2,
              bg: 'primary',
              color: 'primary.foreground',
              fontSize: 'sm',
              fontWeight: 'medium',
              rounded: 'lg',
              cursor: 'pointer',
              border: 'none',
              _hover: { opacity: 0.9 },
              transitionProperty: 'opacity',
              transitionDuration: '200ms',
              transitionTimingFunction: 'ease-in-out',
            })}
          >
            여행 계획하기
          </button>
        </div>
      </div>
    </header>
  )
}
