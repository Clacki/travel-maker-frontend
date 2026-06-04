export type SubTag = {
  id: string
  name: string
  icon: string
}

export type TravelCategory = {
  id: string
  name: string
  description: string
  image: string
  subTags: SubTag[]
  destinations: Destination[]
}

export type Destination = {
  id: string
  name: string
  location: string
  description: string
  image: string
  rating: number
  tags: string[]
}

export type FilterOptions = {
  selectedTags: string[]
}
