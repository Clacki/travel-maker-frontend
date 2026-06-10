import { create } from 'zustand'

import type {
  CourseDateRange,
  CoursePlace,
  DepartureTime,
} from '@/features/trips/types/course.types'
import { MAX_PLACES_PER_DAY } from '@/features/trips/types/course.types'
import { mockCoursePlaces } from '@/mocks/data/trips-data'

type CourseStore = {
  title: string
  description: string
  selectedRegion: string | null
  selectedThemes: string[]
  places: CoursePlace[]
  dateRange: CourseDateRange | null
  departureTime: DepartureTime
  selectedDay: number
  selectedPlaceId: string | null
  estimatedHours: number
  estimatedMinutes: number
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setRegion: (region: string | null) => void
  toggleTheme: (theme: string) => void
  addPlace: (place: Omit<CoursePlace, 'dayIndex'>) => void
  removePlace: (placeId: string) => void
  reorderPlaces: (newPlaces: CoursePlace[]) => void
  updatePlaceDetail: (
    placeId: string,
    patch: Partial<
      Pick<CoursePlace, 'stayMinutes' | 'memo' | 'transportMode' | 'dayIndex'>
    >
  ) => void
  setDateRange: (range: CourseDateRange | null) => void
  setDepartureTime: (time: DepartureTime) => void
  setSelectedDay: (day: number) => void
  setSelectedPlaceId: (id: string | null) => void
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
  selectedPlaceId: null,
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
      const dayPlaceCount = state.places.filter(
        (p) => p.dayIndex === state.selectedDay
      ).length
      if (dayPlaceCount >= MAX_PLACES_PER_DAY) {
        return state
      }
      return {
        places: [...state.places, { ...place, dayIndex: state.selectedDay }],
      }
    }),

  removePlace: (placeId) =>
    set((state) => ({
      places: state.places.filter((p) => p.id !== placeId),
    })),

  reorderPlaces: (newPlaces) => set({ places: newPlaces }),

  updatePlaceDetail: (placeId, patch) =>
    set((state) => ({
      places: state.places.map((p) =>
        p.id === placeId ? { ...p, ...patch } : p
      ),
    })),

  setDateRange: (range) => set({ dateRange: range }),

  setDepartureTime: (time) => set({ departureTime: time }),

  setSelectedDay: (day) => set({ selectedDay: day }),

  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),

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
      selectedPlaceId: null,
      estimatedHours: 0,
      estimatedMinutes: 0,
    }),
}))
