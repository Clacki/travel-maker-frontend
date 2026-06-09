export type TripPageMode = 'list' | 'create' | 'detail' | 'edit'

const tripPageTitleMap: Record<TripPageMode, string> = {
  list: 'Trips',
  create: '새 여행 코스 만들기',
  detail: '여행 코스 상세',
  edit: '여행 코스 수정',
}

export const getTripPageTitle = (mode: TripPageMode) => {
  return tripPageTitleMap[mode]
}
