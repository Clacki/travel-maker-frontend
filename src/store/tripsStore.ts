import { create } from 'zustand'

import type {
  CourseDateRange,
  CoursePlace,
  DepartureTime,
} from '@/features/trips/types/course.types'
import { MAX_PLACES_PER_DAY } from '@/features/trips/types/course.types'

type CourseStoreState = {
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
  isDirty: boolean
  focusLocation: { lat: number; lng: number } | null
}

type CourseStore = CourseStoreState & {
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
      Pick<
        CoursePlace,
        'stayMinutes' | 'travelMinutes' | 'memo' | 'transportMode' | 'dayIndex'
      >
    >
  ) => void
  setDateRange: (range: CourseDateRange | null) => void
  setDepartureTime: (time: DepartureTime) => void
  setSelectedDay: (day: number) => void
  setSelectedPlaceId: (id: string | null) => void
  setEstimatedHours: (hours: number) => void
  setEstimatedMinutes: (minutes: number) => void
  setFocusLocation: (location: { lat: number; lng: number } | null) => void
  initCourse: (data: Partial<Omit<CourseStoreState, 'isDirty'>>) => void
  resetCourse: () => void
}

export const useCourseStore = create<CourseStore>((set) => ({
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
  isDirty: false,
  focusLocation: null,

  setTitle: (title) => set({ title, isDirty: true }),

  setDescription: (description) => set({ description, isDirty: true }),

  setRegion: (region) =>
    set((state) => ({
      selectedRegion: state.selectedRegion === region ? null : region,
      isDirty: true,
    })),

  toggleTheme: (theme) =>
    set((state) => {
      const exists = state.selectedThemes.includes(theme)
      return {
        selectedThemes: exists
          ? state.selectedThemes.filter((t) => t !== theme)
          : [...state.selectedThemes, theme],
        isDirty: true,
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
        isDirty: true,
      }
    }),

  removePlace: (placeId) =>
    set((state) => ({
      places: state.places.filter((p) => p.id !== placeId),
      isDirty: true,
    })),

  reorderPlaces: (newPlaces) => set({ places: newPlaces, isDirty: true }),

  updatePlaceDetail: (placeId, patch) =>
    set((state) => ({
      places: state.places.map((p) =>
        p.id === placeId ? { ...p, ...patch } : p
      ),
      isDirty: true,
    })),

  setDateRange: (range) => set({ dateRange: range, isDirty: true }),

  setDepartureTime: (time) => set({ departureTime: time, isDirty: true }),

  setSelectedDay: (day) => set({ selectedDay: day }),

  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),

  setEstimatedHours: (hours) => set({ estimatedHours: hours, isDirty: true }),

  setEstimatedMinutes: (minutes) =>
    set({ estimatedMinutes: minutes, isDirty: true }),

  setFocusLocation: (location) => set({ focusLocation: location }),

  initCourse: (data) => set({ ...data, isDirty: false }),

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
      isDirty: false,
      focusLocation: null,
    }),
}))
