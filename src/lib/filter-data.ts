import type { TagVariant } from '@/components/filters/tag'
import type { BadgeVariant } from '@/components/filters/filter-section'

export interface FilterTag {
  id: string
  label: string
  emoji?: string
  variant?: TagVariant
}

export interface FilterSectionData {
  id: string
  icon: string
  label: string
  typeLabel: string
  badgeVariant: BadgeVariant
  selectionMode: 'multi' | 'single'
  tags: FilterTag[]
}

export const travelFilterSections: FilterSectionData[] = [
  {
    id: 'style',
    icon: '\u{1F5FA}\uFE0F',
    label: '\uC5EC\uD589 \uC2A4\uD0C0\uC77C',
    typeLabel: '\uBCF5\uC218 \uC120\uD0DD',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'beach', label: '\uD574\uBCC0', emoji: '\u{1F3D6}\uFE0F' },
      { id: 'mountain', label: '\uC0B0\uC545', emoji: '\u{1F3D4}\uFE0F' },
      { id: 'city', label: '\uB3C4\uC2DC', emoji: '\u{1F3D9}\uFE0F' },
      { id: 'culture', label: '\uBB38\uD654', emoji: '\u{1F3AD}' },
      { id: 'food', label: '\uBBF8\uC2DD', emoji: '\u{1F35C}' },
      { id: 'activity', label: '\uC561\uD2F0\uBE44\uD2F0', emoji: '\u{1F9D7}' },
      { id: 'romantic', label: '\uB85C\uB9E8\uD2F1', emoji: '\u{1F495}' },
    ],
  },
  {
    id: 'theme',
    icon: '\u{1F3F7}\uFE0F',
    label: '\uC138\uBD80 \uD14C\uB9C8',
    typeLabel: '\uBCF5\uC218 \uC120\uD0DD',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'beach-coast', label: '\uD574\uC218\uC695\xB7\uD574\uC548' },
      { id: 'water-sports', label: '\uC218\uC0C1\uB808\uC800' },
      { id: 'camping', label: '\uCE60\uD551\xB7\uAE00\uB7A8\uD551' },
      { id: 'mountain-valley', label: '\uC0B0\xB7\uC232\xB7\uACC4\uACE1' },
      { id: 'nature-eco', label: '\uC790\uC5F0\uC0DD\uD0DC' },
      {
        id: 'trekking',
        label: '\uC790\uC5F0\uACF5\uC6D0\xB7\uD2B8\uB808\uD0B9',
      },
      { id: 'landmark', label: '\uB79C\uB4DC\uB9C8\uD06C' },
      { id: 'park-street', label: '\uACF5\uC6D0\xB7\uAC70\uB9AC' },
      { id: 'shopping', label: '\uC1FC\uD551' },
      { id: 'history', label: '\uC5ED\uC0AC\xB7\uC720\uC801' },
      { id: 'museum', label: '\uBC15\uBB3C\uAD00\xB7\uC804\uC2DC' },
      { id: 'traditional', label: '\uC804\uD1B5\uCCB4\uD5D8' },
      { id: 'restaurant', label: '\uC74C\uC2DD\uC810' },
      { id: 'cafe', label: '\uCE74\uD398\xB7\uB514\uC800\uD2B8' },
      { id: 'market', label: '\uC2DC\uC7A5\xB7\uBA39\uAC70\uB9AC' },
      { id: 'land-sports', label: '\uC721\uC0C1\uC2A4\uD3EC\uCE20' },
      { id: 'extreme', label: '\uD56D\uACF5\xB7\uC775\uC2A4\uD2B8\uB9BC' },
      { id: 'spa', label: '\uC2A4\uD30C\xB7\uC6F0\uB2C8\uC2A4' },
      { id: 'resort', label: '\uC219\uBC15\xB7\uB9AC\uC870\uD2B8' },
    ],
  },
  {
    id: 'companion',
    icon: '\u{1F465}',
    label: '\uB3D9\uD589',
    typeLabel: '\uBCF5\uC218 \uC120\uD0DD',
    badgeVariant: 'multi',
    selectionMode: 'multi',
    tags: [
      { id: 'solo', label: '\uD63C\uC790', emoji: '\u{1F64B}' },
      { id: 'couple', label: '\uCEE4\uD50C', emoji: '\u{1F491}' },
      {
        id: 'family',
        label: '\uAC00\uC871',
        emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}',
      },
      { id: 'friends', label: '\uCE5C\uAD6C', emoji: '\u{1F91D}' },
    ],
  },
  {
    id: 'region',
    icon: '\u{1F4CD}',
    label: '\uC9C0\uC5ED',
    typeLabel: '1\uAC1C \uC120\uD0DD',
    badgeVariant: 'single',
    selectionMode: 'single',
    tags: [
      { id: 'seoul', label: '\uC11C\uC6B8', variant: 'region' as TagVariant },
      {
        id: 'gyeonggi',
        label: '\uACBD\uAE30',
        variant: 'region' as TagVariant,
      },
      { id: 'incheon', label: '\uC778\uCC9C', variant: 'region' as TagVariant },
      { id: 'gangwon', label: '\uAC15\uC6D0', variant: 'region' as TagVariant },
      {
        id: 'chungbuk',
        label: '\uCDA9\uBD81',
        variant: 'region' as TagVariant,
      },
      {
        id: 'chungnam',
        label: '\uCDA9\uB0A8',
        variant: 'region' as TagVariant,
      },
      { id: 'daejeon', label: '\uB300\uC804', variant: 'region' as TagVariant },
      { id: 'sejong', label: '\uC138\uC885', variant: 'region' as TagVariant },
      { id: 'jeonbuk', label: '\uC804\uBD81', variant: 'region' as TagVariant },
      { id: 'jeonnam', label: '\uC804\uB0A8', variant: 'region' as TagVariant },
      { id: 'gwangju', label: '\uAD11\uC8FC', variant: 'region' as TagVariant },
      {
        id: 'gyeongbuk',
        label: '\uACBD\uBD81',
        variant: 'region' as TagVariant,
      },
      {
        id: 'gyeongnam',
        label: '\uACBD\uB0A8',
        variant: 'region' as TagVariant,
      },
      { id: 'daegu', label: '\uB300\uAD6C', variant: 'region' as TagVariant },
      { id: 'ulsan', label: '\uC6B8\uC0B0', variant: 'region' as TagVariant },
      { id: 'busan', label: '\uBD80\uC0B0', variant: 'region' as TagVariant },
      { id: 'jeju', label: '\uC81C\uC8FC', variant: 'region' as TagVariant },
    ],
  },
  {
    id: 'facility',
    icon: '\u{1F17F}\uFE0F',
    label: '\uD3B8\uC758\uC2DC\uC124',
    typeLabel: '\uBCF5\uC218 \uC120\uD0DD',
    badgeVariant: 'bool',
    selectionMode: 'multi',
    tags: [
      {
        id: 'parking',
        label: '\uC8FC\uCC28 \uAC00\uB2A5',
        variant: 'toggle' as TagVariant,
      },
      {
        id: 'pet',
        label: '\uBC18\uB824\uB3D9\uBB3C \uB3D9\uBC18',
        variant: 'toggle' as TagVariant,
      },
      {
        id: 'free',
        label: '\uBB34\uB8CC \uC785\uC7A5',
        variant: 'toggle' as TagVariant,
      },
    ],
  },
]
