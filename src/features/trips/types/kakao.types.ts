// 카카오맵 SDK 공식 타입 미제공 → 최소 필요 인터페이스 정의
export interface KakaoLatLng {
  getLat: () => number
  getLng: () => number
}

export interface KakaoLatLngBounds {
  extend: (latlng: KakaoLatLng) => void
}

export interface KakaoOverlay {
  setMap: (map: KakaoMapInstance | null) => void
}

export interface KakaoPolyline {
  setMap: (map: KakaoMapInstance | null) => void
}

export interface KakaoMapInstance {
  setBounds: (bounds: KakaoLatLngBounds) => void
  panTo: (latlng: KakaoLatLng) => void
}
