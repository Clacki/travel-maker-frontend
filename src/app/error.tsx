'use client'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h1>오류가 발생했어요</h1>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
