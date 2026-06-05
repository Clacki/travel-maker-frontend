"use client"

import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { css } from "@/styled-system/css"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={css({
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        bg: "#FEFEFE",
        h: "66px",
      })}
    >
      <div
        className={css({
          maxW: "7xl",
          mx: "auto",
          px: 6,
          h: "full",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Link
          href="/"
          className={css({ textDecoration: "none" })}
        >
          <span
            className={css({
              fontSize: "2xl",
              fontWeight: "800",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--colors-primary) 0%, var(--colors-accent) 100%)",
              backgroundClip: "text",
              color: "transparent",
            })}
          >
            TravelMaker
          </span>
        </Link>

        <nav
          className={css({
            display: { base: "none", md: "flex" },
            alignItems: "center",
            gap: 8,
          })}
        >
          {[
            { label: "Travel Style", href: "/" },
            { label: "Explore", href: "/travel/explore" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={css({
                fontSize: "sm",
                color: "muted.foreground",
                textDecoration: "none",
                _hover: { color: "foreground" },
                transition: "colors",
              })}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={css({ display: "flex", alignItems: "center", gap: 3 })}>
          {/* {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={css({
                w: 10,
                h: 10,
                rounded: "lg",
                bg: "secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                _hover: { bg: "secondary/80" },
                transition: "colors",
              })}
              aria-label="테마 변경"
            >
              {theme === "dark" ? (
                <Sun className={css({ w: 5, h: 5, color: "foreground" })} />
              ) : (
                <Moon className={css({ w: 5, h: 5, color: "foreground" })} />
              )}
            </button>
          )} */}
          <button
            className={css({
              px: 4,
              py: 2,
              bg: "white",
              color: "muted.foreground",
              fontSize: "sm",
              fontWeight: "medium",
              rounded: "lg",
              cursor: "pointer",
              border: "none",
              _hover: { opacity: 0.9 },
              transition: "opacity",
            })}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  )
}
