'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { css } from '@/styled-system/css'

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) return null

  return (
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
  )
}
