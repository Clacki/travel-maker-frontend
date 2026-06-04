interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
}
