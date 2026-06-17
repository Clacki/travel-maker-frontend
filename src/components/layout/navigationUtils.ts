type SearchParamsLike = {
  toString: () => string
}

function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname

  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

export function getPathWithSearch(
  pathname: string,
  searchParams: string | SearchParamsLike
) {
  const search =
    typeof searchParams === 'string'
      ? searchParams.replace(/^\?/, '')
      : searchParams.toString()

  return `${normalizePathname(pathname)}${search ? `?${search}` : ''}`
}

export function getSameOriginPathWithSearch(href: string, origin: string) {
  try {
    const targetUrl = new URL(href, origin)

    if (targetUrl.origin !== origin) {
      return null
    }

    return getPathWithSearch(targetUrl.pathname, targetUrl.search)
  } catch {
    return null
  }
}

interface IsSameInternalHrefParams {
  href: string
  origin: string
  currentPathname: string
  currentSearchParams: string | SearchParamsLike
}

export function isSameInternalHref({
  href,
  origin,
  currentPathname,
  currentSearchParams,
}: IsSameInternalHrefParams) {
  const targetPath = getSameOriginPathWithSearch(href, origin)

  if (!targetPath) {
    return false
  }

  return targetPath === getPathWithSearch(currentPathname, currentSearchParams)
}
