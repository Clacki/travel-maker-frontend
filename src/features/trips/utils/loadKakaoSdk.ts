// 모듈 레벨 싱글턴 — 최초 1회만 script 삽입
let sdkPromise: Promise<void> | null = null

export function loadKakaoSdk(appKey: string): Promise<void> {
  if (sdkPromise) {
    return sdkPromise
  }
  if (typeof window !== 'undefined' && window.kakao?.maps) {
    sdkPromise = new Promise<void>((resolve) => window.kakao.maps.load(resolve))
    return sdkPromise
  }
  sdkPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
    script.onload = () => window.kakao.maps.load(resolve)
    document.head.appendChild(script)
  })
  return sdkPromise
}
