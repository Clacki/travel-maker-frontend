// 디자인 토큰 raw 값 (카카오맵 DOM API는 Panda CSS 토큰 미지원)
export const PRIMARY_COLOR = '#2CA6BE' // semantic token 'primary'
export const INVERSE_COLOR = '#ffffff' // semantic token 'text.inverse'

// 카카오맵 CustomOverlay DOM 생성 유틸 (순수 함수)
export function createMarkerOverlay(
  label: string,
  color: string
): { el: HTMLDivElement; tailInner: HTMLDivElement } {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:relative',
    'display:inline-flex',
    'align-items:center',
    'justify-content:center',
    'min-width:28px',
    'height:28px',
    'padding:0 8px',
    `background:${color}`,
    'color:#fff',
    'font-size:12px',
    'font-weight:bold',
    'border-radius:12px',
    'border:none',
    'box-shadow:0 2px 6px rgba(0,0,0,0.25)',
    'cursor:default',
    'white-space:nowrap',
    'transition:all 0.2s ease',
  ].join(';')

  const tailOuter = document.createElement('div')
  tailOuter.style.cssText = [
    'position:absolute',
    'bottom:-10px',
    'left:50%',
    'transform:translateX(-50%)',
    'width:0',
    'height:0',
    'border-left:8px solid transparent',
    'border-right:8px solid transparent',
    `border-top:10px solid ${color}`,
  ].join(';')

  const tailInner = document.createElement('div')
  tailInner.style.cssText = [
    'position:absolute',
    'bottom:-7px',
    'left:50%',
    'transform:translateX(-50%)',
    'width:0',
    'height:0',
    'border-left:6px solid transparent',
    'border-right:6px solid transparent',
    `border-top:8px solid ${color}`,
  ].join(';')

  el.textContent = label
  el.appendChild(tailOuter)
  el.appendChild(tailInner)

  return { el, tailInner }
}
