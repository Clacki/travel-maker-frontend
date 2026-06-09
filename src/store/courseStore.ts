import { create } from 'zustand'

import type {
  CourseDateRange,
  CoursePlace,
  DepartureTime,
} from '@/features/course/course.types'
import { MAX_PLACES } from '@/features/course/course.types'
import { mockCoursePlaces } from '@/mocks/data/course-data'

type CourseStore = {
  title: string
  description: string
  selectedRegion: string | null
  selectedThemes: string[]
  places: CoursePlace[]
  dateRange: CourseDateRange | null
  departureTime: DepartureTime
  selectedDay: number
  estimatedHours: number
  estimatedMinutes: number
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setRegion: (region: string | null) => void
  toggleTheme: (theme: string) => void
  addPlace: (place: CoursePlace) => void
  removePlace: (placeId: string) => void
  movePlaceUp: (placeId: string) => void
  movePlaceDown: (placeId: string) => void
  setDateRange: (range: CourseDateRange | null) => void
  setDepartureTime: (time: DepartureTime) => void
  setSelectedDay: (day: number) => void
  setEstimatedHours: (hours: number) => void
  setEstimatedMinutes: (minutes: number) => void
  resetCourse: () => void
}

export const useCourseStore = create<CourseStore>((set) => ({
  title: '',
  description: '',
  selectedRegion: null,
  selectedThemes: [],
  places: mockCoursePlaces, // TODO: API 연결 후 [] 로 교체
  dateRange: null,
  departureTime: { period: 'am', hour: 10, minute: 0 },
  selectedDay: 1,
  estimatedHours: 0,
  estimatedMinutes: 0,

  setTitle: (title) => set({ title }),

  setDescription: (description) => set({ description }),

  setRegion: (region) =>
    set((state) => ({
      selectedRegion: state.selectedRegion === region ? null : region,
    })),

  toggleTheme: (theme) =>
    set((state) => {
      const exists = state.selectedThemes.includes(theme)
      return {
        selectedThemes: exists
          ? state.selectedThemes.filter((t) => t !== theme)
          : [...state.selectedThemes, theme],
      }
    }),

  addPlace: (place) =>
    set((state) => {
      if (state.places.length >= MAX_PLACES) {
        return state
      }
      return { places: [...state.places, place] }
    }),

  removePlace: (placeId) =>
    set((state) => ({
      places: state.places.filter((p) => p.id !== placeId),
    })),

  movePlaceUp: (placeId) =>
    set((state) => {
      const index = state.places.findIndex((p) => p.id === placeId)
      if (index <= 0) {
        return state
      }
      const newPlaces = [...state.places]
      const temp = newPlaces[index - 1]
      newPlaces[index - 1] = newPlaces[index]
      newPlaces[index] = temp
      return { places: newPlaces }
    }),

  movePlaceDown: (placeId) =>
    set((state) => {
      const index = state.places.findIndex((p) => p.id === placeId)
      if (index < 0 || index >= state.places.length - 1) {
        return state
      }
      const newPlaces = [...state.places]
      const temp = newPlaces[index + 1]
      newPlaces[index + 1] = newPlaces[index]
      newPlaces[index] = temp
      return { places: newPlaces }
    }),

  setDateRange: (range) => set({ dateRange: range }),

  setDepartureTime: (time) => set({ departureTime: time }),

  setSelectedDay: (day) => set({ selectedDay: day }),

  setEstimatedHours: (hours) => set({ estimatedHours: hours }),

  setEstimatedMinutes: (minutes) => set({ estimatedMinutes: minutes }),

  resetCourse: () =>
    set({
      title: '',
      description: '',
      selectedRegion: null,
      selectedThemes: [],
      places: [],
      dateRange: null,
      departureTime: { period: 'am', hour: 10, minute: 0 },
      selectedDay: 1,
      estimatedHours: 0,
      estimatedMinutes: 0,
    }),
}))
