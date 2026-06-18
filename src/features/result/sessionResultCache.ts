import type { QuizSubmitResponse } from './quizSubmit.types'

const STORAGE_PREFIX = 'quiz_api_result_'

/**
 * useSyncExternalStore snapshot 안정성을 위한 모듈 레벨 캐시.
 * sessionStorage read/write를 항상 이 모듈을 통해 수행해
 * quizStore와 ResultClientLayer 간 일관성을 보장한다.
 */
const _cache = new Map<string, QuizSubmitResponse | null>()
const _listeners = new Set<() => void>()

/** useSyncExternalStore의 subscribe 함수로 전달한다. */
export function subscribeSessionResultCache(listener: () => void): () => void {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

function _notify() {
  _listeners.forEach((l) => l())
}

export function readSessionResultCache(key: string): QuizSubmitResponse | null {
  if (!key) return null
  if (_cache.has(key)) return _cache.get(key)!
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
    const result = raw ? (JSON.parse(raw) as QuizSubmitResponse) : null
    _cache.set(key, result)
    return result
  } catch {
    _cache.set(key, null)
    return null
  }
}

export function writeSessionResultCache(
  key: string,
  result: QuizSubmitResponse
): void {
  _cache.set(key, result)
  _notify()
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(result))
  } catch (e) {
    console.warn('[sessionResultCache] sessionStorage 쓰기 실패:', e)
  }
}

export function clearSessionResultCache(key?: string): void {
  if (key) {
    _cache.delete(key)
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch {}
  } else {
    _cache.clear()
  }
  _notify()
}
