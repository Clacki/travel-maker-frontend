'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>오류가 발생했어요</h1>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
