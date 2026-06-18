'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { css, cx } from '@/styled-system/css'
import type { TravelCategory } from '@/types/travel.types'

const CARD_COUNT = 7
const ANGLE_STEP = (2 * Math.PI) / CARD_COUNT

const CARD_W = 140
const CARD_H = 196

// 원근감 고정값
const RZ = 90
const PERSP = 280

// 200px 드래그 = 카드 1칸
const DRAG_SENS = ANGLE_STEP / 200
// 자동 회전: 카드 1칸 = 5초
const AUTO_SPEED = ANGLE_STEP / 5

const CATEGORY_TO_STYLE: Record<string, string> = {
  beach: 'beach',
  mountain: 'mountain',
  city: 'city',
  culture: 'culture',
  food: 'food',
  adventure: 'activity',
  romantic: 'romantic',
}

function EllipseCard({
  category,
  index,
  rotation,
  rx,
  ry,
  getDragDist,
}: {
  category: TravelCategory
  index: number
  rotation: ReturnType<typeof useMotionValue<number>>
  rx: ReturnType<typeof useMotionValue<number>>
  ry: ReturnType<typeof useMotionValue<number>>
  getDragDist: () => number
}) {
  const baseAngle = (index / CARD_COUNT) * 2 * Math.PI
  const styleId = CATEGORY_TO_STYLE[category.id] ?? category.id

  // 수평 위치
  const x = useTransform(
    [rotation, rx] as const,
    ([r, rxVal]) => (rxVal as number) * Math.sin(baseAngle + (r as number))
  )

  // 수직 위치: 앞(cos=1) → 아래, 뒤(cos=-1) → 위 (눕힌 원반 효과)
  const y = useTransform([rotation, ry] as const, ([r, ryVal]) => {
    const cosA = Math.cos(baseAngle + (r as number))
    return cosA * (ryVal as number)
  })

  // 원근감 scale
  const scale = useTransform(rotation, (r) => {
    const z = RZ * Math.cos(baseAngle + r)
    return (PERSP + z) / PERSP
  })

  // 앞 카드 선명, 뒤 카드 반투명
  const opacity = useTransform(rotation, (r) => {
    const z = RZ * Math.cos(baseAngle + r)
    return 0.45 + 0.55 * ((z + RZ) / (2 * RZ))
  })

  // 앞 카드가 위에 표시
  const zIndex = useTransform(rotation, (r) => {
    const z = RZ * Math.cos(baseAngle + r)
    return Math.round(((z + RZ) / (2 * RZ)) * 20)
  })

  const handleClick = (e: React.MouseEvent) => {
    if (getDragDist() > 8) e.preventDefault()
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: `-${CARD_W / 2}px`,
        marginTop: `-${CARD_H / 2}px`,
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        x,
        y,
        scale,
        opacity,
        zIndex,
        originX: 0.5,
        originY: 0.5,
      }}
    >
      <Link
        href={`/explore?category=${category.id}&style=${styleId}`}
        onClick={handleClick}
        draggable={false}
        className={css({
          display: 'flex',
          flexDir: 'column',
          w: '140px',
          h: '196px',
          rounded: 'lg',
          bg: 'bg.surface',
          pt: '8px',
          px: '8px',
          pb: 0,
          shadow: 'lg',
          cursor: 'pointer',
          textDecoration: 'none',
          overflow: 'hidden',
          '& .card-img': {
            transitionProperty: 'transform',
            transitionDuration: '400ms',
          },
          '&:hover .card-img': { transform: 'scale(1.06)' },
        })}
      >
        <div
          className={css({
            position: 'relative',
            flex: '0 0 80%',
            overflow: 'hidden',
            rounded: 'lg',
          })}
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="140px"
            className={cx(css({ objectFit: 'cover' }), 'card-img')}
          />
        </div>
        <div
          className={css({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: '4px',
          })}
        >
          <h3
            className={css({
              fontSize: 'xs',
              fontWeight: 'medium',
              color: 'text.primary',
              textAlign: 'center',
            })}
          >
            {category.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  )
}

interface CategoryCardSwiperProps {
  categories: TravelCategory[]
}

export function CategoryCardSwiper({ categories }: CategoryCardSwiperProps) {
  const rotation = useMotionValue(0)
  // 반응형 반지름: 태블릿(≥768px)에서 더 넓게
  const rx = useMotionValue(130)
  const ry = useMotionValue(45)
  const [containerH, setContainerH] = useState(350)

  const startX = useRef(0)
  const startRot = useRef(0)
  const isDown = useRef(false)
  const isSnapping = useRef(false)
  const dragDist = useRef(0)

  // 뷰포트 크기에 따른 반지름·컨테이너 높이 조정
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      if (w >= 768) {
        rx.set(Math.min(260, w * 0.27))
        ry.set(Math.min(85, w * 0.09))
        setContainerH(350)
      } else if (h < 700) {
        // iPhone SE(667px) 등 세로가 짧은 기기: 컨테이너 축소로 하단 클리핑 방지
        rx.set(110)
        ry.set(15)
        setContainerH(290)
      } else {
        rx.set(130)
        ry.set(45)
        setContainerH(350)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [rx, ry])

  // 자동 회전 루프
  useEffect(() => {
    let raf: number
    let lastTime = 0

    const loop = (time: number) => {
      if (lastTime !== 0 && !isDown.current && !isSnapping.current) {
        const dt = (time - lastTime) / 1000
        rotation.set(rotation.get() + AUTO_SPEED * dt)
      }
      lastTime = time
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [rotation])

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
    startRot.current = rotation.get()
    isDown.current = true
    dragDist.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDown.current) return
    const delta = e.clientX - startX.current
    dragDist.current = Math.abs(delta)
    rotation.set(startRot.current + delta * DRAG_SENS)
  }

  const snap = () => {
    if (!isDown.current) return
    isDown.current = false
    isSnapping.current = true
    const curr = rotation.get()
    const snapped = Math.round(curr / ANGLE_STEP) * ANGLE_STEP
    animate(rotation, snapped, {
      type: 'spring',
      stiffness: 180,
      damping: 24,
      onComplete: () => {
        isSnapping.current = false
      },
    })
  }

  return (
    <div
      className={css({
        w: 'full',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        cursor: 'grab',
      })}
      style={{ height: `${containerH}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={snap}
      onPointerLeave={snap}
      onPointerCancel={snap}
    >
      {categories.map((category, index) => (
        <EllipseCard
          key={category.id}
          category={category}
          index={index}
          rotation={rotation}
          rx={rx}
          ry={ry}
          getDragDist={() => dragDist.current}
        />
      ))}
    </div>
  )
}
