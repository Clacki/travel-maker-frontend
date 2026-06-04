'use client'

import { motion } from 'framer-motion'
import type { SubTag } from '@/types/travel'
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
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: 3 })}>
      {subTags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag.id)
        return (
          <motion.button
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onTagToggle(tag.id)}
            className={css({
              px: 4,
              py: '10px',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.3s',
              bg: isSelected ? 'primary' : 'secondary',
              color: isSelected ? 'primary.foreground' : 'secondary.foreground',
              shadow: isSelected ? 'md' : 'none',
              _hover: {
                opacity: isSelected ? 0.9 : 0.8,
              },
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
