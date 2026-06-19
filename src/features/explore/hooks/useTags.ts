'use client'

import { useState, useEffect } from 'react'
import { getTags } from '../api/tagsApi'
import type { Tag } from '../types/tags.types'
import {
  FILTER_TAG_TO_TAG_NAME,
  STYLE_TO_CATEGORY,
  CATEGORY_TO_TAG_NAME,
} from '../constants'

export function useTags() {
  const [tags, setTags] = useState<Tag[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    getTags()
      .then((data) => {
        if (!cancelled) setTags(data)
      })
      .catch((cause) => {
        if (cancelled) return

        console.error('Failed to load explore tags.', cause)
        setError(
          cause instanceof Error ? cause : new Error('Failed to load tags')
        )
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { tags, isLoading, error }
}

export function getSelectedTagIds(
  selected: Record<string, string[]>,
  categoryId: string | null,
  tags: Tag[] | null
) {
  const tagNameToId = new Map((tags ?? []).map((t) => [t.tag_name, t.id]))
  const ids: number[] = []

  const styleValues = (selected.style ?? []).filter((s) => s !== 'all')
  for (const s of styleValues) {
    const cat = STYLE_TO_CATEGORY[s] ?? s
    const id = tagNameToId.get(CATEGORY_TO_TAG_NAME[cat] ?? '')
    if (id !== undefined) ids.push(id)
  }

  for (const section of ['theme', 'companion', 'region', 'facility']) {
    for (const v of selected[section] ?? []) {
      const id = tagNameToId.get(FILTER_TAG_TO_TAG_NAME[v] ?? '')
      if (id !== undefined) ids.push(id)
    }
  }

  if (ids.length === 0 && categoryId) {
    const id = tagNameToId.get(CATEGORY_TO_TAG_NAME[categoryId] ?? '')
    if (id !== undefined) return [id]
  }

  return ids
}
