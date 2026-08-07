import { delay, http, HttpResponse } from 'msw'
import { demoRouteDetails, demoRouteList } from '../data/routeData'

const paginate = <T>(items: T[], request: Request) => {
  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const pageSize = Math.max(1, Number(url.searchParams.get('page_size')) || 9)
  const start = (page - 1) * pageSize
  const pageUrl = (target: number) => {
    const params = new URLSearchParams(url.searchParams)
    params.set('page', String(target))
    params.set('page_size', String(pageSize))
    return `${url.origin}${url.pathname}?${params.toString()}`
  }

  return {
    count: items.length,
    next: start + pageSize < items.length ? pageUrl(page + 1) : null,
    previous: page > 1 ? pageUrl(page - 1) : null,
    results: items.slice(start, start + pageSize),
  }
}

export const routeHandlers = [
  http.get('*/routes', async ({ request }) => {
    await delay(180)
    const url = new URL(request.url)
    const regionTagId = Number(url.searchParams.get('region_tag_id')) || null
    const themeTagIds = url.searchParams
      .getAll('theme_tag_ids')
      .map(Number)
      .filter(Number.isFinite)
    const taxonomy: Record<number, { region: number; themes: number[] }> = {
      501: { region: 48, themes: [1, 2, 15] },
      502: { region: 32, themes: [3, 4, 17] },
      503: { region: 47, themes: [1, 5] },
    }
    const routes = demoRouteList.filter((route) => {
      const tags = taxonomy[route.route_id]
      const regionMatches = !regionTagId || tags.region === regionTagId
      const themesMatch =
        themeTagIds.length === 0 ||
        themeTagIds.every((tagId) => tags.themes.includes(tagId))
      return regionMatches && themesMatch
    })
    return HttpResponse.json(paginate(routes, request))
  }),
  http.get('*/routes/:routeId', async ({ params }) => {
    await delay(180)
    const route = demoRouteDetails[Number(params.routeId)]
    return route
      ? HttpResponse.json(route)
      : HttpResponse.json({ detail: 'Route not found.' }, { status: 404 })
  }),
]
