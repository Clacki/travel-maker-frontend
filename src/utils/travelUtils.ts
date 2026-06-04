import type { Destination, TravelCategory } from '@/types/travel'
import { travelCategories } from '@/mocks/travel-data'

export function getCategoryById(id: string): TravelCategory | undefined {
  return travelCategories.find((category) => category.id === id)
}

export function filterDestinationsByTags(
  destinations: Destination[],
  selectedTags: string[]
): Destination[] {
  if (selectedTags.length === 0) {
    return destinations
  }
  return destinations.filter((destination) =>
    selectedTags.some((tag) => destination.tags.includes(tag))
  )
}
