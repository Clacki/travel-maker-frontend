'use client'

import { motion } from 'framer-motion'
import type { SubTag } from '@/types/travel.types'
import { css } from '@/styled-system/css'

interface SubTagFilterProps {
  subTags: SubTag[]
  selectedTags: string[]
  onTagToggle: (tagId: string) => void
}

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
            className={css({
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
              bg: isSelected ? 'primary' : 'bg.muted',
              color: isSelected ? 'text.inverse' : 'text.primary',
              boxShadow: isSelected ? 'sm' : 'none',
              _hover: { opacity: isSelected ? 0.9 : 0.8 },
              _focusVisible: { outline: 'none', boxShadow: 'focus' },
            })}
          >
            <span className={css({ fontSize: 'md' })}>{tag.icon}</span>
            <span>{tag.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
