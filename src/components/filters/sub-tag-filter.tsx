'use client'

import { motion } from 'framer-motion'
import type { SubTag } from '@/types/travel.types'
import { css, cva } from '@/styled-system/css'

interface SubTagFilterProps {
  subTags: SubTag[]
  selectedTags: string[]
  onTagToggle: (tagId: string) => void
}

const subTagButtonStyle = cva({
  base: {
    px: '4',
    py: '2',
    borderRadius: 'pill',
    fontSize: 'sm',
    fontWeight: 'medium',
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    cursor: 'pointer',
    border: 'none',
    transitionProperty: 'opacity',
    transitionDuration: '150ms',
    _focusVisible: { outline: 'none', boxShadow: 'focus' },
  },
  variants: {
    isSelected: {
      true: {
        bg: 'primary',
        color: 'text.inverse',
        boxShadow: 'sm',
        _hover: { opacity: 0.9 },
      },
      false: {
        bg: 'bg.muted',
        color: 'text.primary',
        _hover: { opacity: 0.8 },
      },
    },
  },
  defaultVariants: { isSelected: false },
})

export function SubTagFilter({
  subTags,
  selectedTags,
  onTagToggle,
}: SubTagFilterProps) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {subTags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag.id)
        return (
          <motion.button
            key={tag.id}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onTagToggle(tag.id)}
            className={subTagButtonStyle({ isSelected })}
          >
            <span className={css({ fontSize: 'md' })}>{tag.icon}</span>
            <span>{tag.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
