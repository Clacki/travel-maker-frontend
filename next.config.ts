import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 한국관광공사 공공데이터
      { protocol: 'https', hostname: 'tong.visitkorea.or.kr' },
    ],
  },
}

export default nextConfig
