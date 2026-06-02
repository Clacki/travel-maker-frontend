import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 한국관광공사 공공데이터
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
      // 카카오 프로필 이미지
      { protocol: 'https', hostname: '**.kakaocdn.net' },
      // 네이버 프로필 이미지
      { protocol: 'https', hostname: 'phinf.pstatic.net' },
    ],
  },
}

export default nextConfig
