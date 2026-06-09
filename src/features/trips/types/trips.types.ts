export type TripVisibility = 'public' | 'private'

export type TripPlace = {
  id: string
  name: string
  address: string
  order: number
}

export type Trip = {
  id: string
  title: string
  description: string
  ownerId: string
  region: string
  startDate: string
  endDate: string
  visibility: TripVisibility
  places: TripPlace[]
  createdAt: string
  updatedAt: string
}

export type TripListItem = Pick<
  Trip,
  | 'id'
  | 'title'
  | 'description'
  | 'ownerId'
  | 'region'
  | 'startDate'
  | 'endDate'
  | 'visibility'
>

export type TripListResponse = {
  trips: TripListItem[]
  totalCount: number
}

export type TripDetailResponse = Trip

export type CreateTripPayload = {
  title: string
  description?: string
  region: string
  startDate: string
  endDate: string
  visibility: TripVisibility
  places: TripPlace[]
}

export type UpdateTripPayload = Partial<CreateTripPayload>
