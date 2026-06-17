export function formatDetailText(text?: string | null): string {
  if (!text) return ''

  return text
    .trim()
    .replace(/\s*(\[[^\]]+\])/g, '\n\n$1')
    .replace(/\s+-\s+/g, '\n- ')
    .replace(/(\])-\s*/g, '$1\n- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
