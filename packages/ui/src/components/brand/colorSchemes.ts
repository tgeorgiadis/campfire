export type ColorSchemeId =
  | 'ember-classic'
  | 'clean-stone'
  | 'terracotta-dusk'
  | 'golden-gather'
  | 'coral-bloom'
  | 'dusk-wine'

export type ColorScheme = {
  id: ColorSchemeId
  name: string
  page: string
  surface: string
  border: string
  text: string
  muted: string
  accent: string
  accentLight: string
  accentBorder: string
  sidebar?: string
  personality: string
  contrastNote: string
  isProduction?: boolean
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'ember-classic',
    name: 'Ember Classic',
    page: '#FFF7EC',
    surface: '#FFFFFF',
    border: '#E8DFD4',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#FF5E3A',
    accentLight: '#FFF0E6',
    accentBorder: '#FFD4B8',
    personality: 'Firelight on faces — warm, energetic, unmistakably Campfire today.',
    contrastNote: 'Accent on white passes AA for large text; body text on cream passes AA.',
  },
  {
    id: 'clean-stone',
    name: 'Clean Stone',
    page: '#F8F7F5',
    surface: '#FFFFFF',
    border: '#E5E3DF',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#FF5E3A',
    accentLight: '#FFF0E6',
    accentBorder: '#FFD4B8',
    personality: 'Same flame accent with a calmer stone page — less yellow, more breathable.',
    contrastNote: 'Accent on white passes AA for large text; stone page improves card lift vs cream.',
  },
  {
    id: 'terracotta-dusk',
    name: 'Terracotta Dusk',
    page: '#F4EFEA',
    surface: '#FFFFFF',
    border: '#E0D8D0',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#C84B31',
    accentLight: '#F5E6DE',
    accentBorder: '#E8C4B0',
    personality: 'Earthy burnt orange — grounded and mature, less neon startup energy.',
    contrastNote: 'Terracotta on white passes AA for large text and buttons.',
  },
  {
    id: 'golden-gather',
    name: 'Golden Gather',
    page: '#FFFBF5',
    surface: '#FFFFFF',
    border: '#EDE6D8',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#D4920A',
    accentLight: '#FFF8E7',
    accentBorder: '#F0D99A',
    personality: 'Amber gold accent — celebratory and warm without loud orange.',
    contrastNote: 'Gold accent on white passes AA for large text; lighter page feels airy.',
  },
  {
    id: 'coral-bloom',
    name: 'Coral Bloom',
    page: '#FFFFFF',
    surface: '#FFFFFF',
    border: '#E8E4E0',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#E5634D',
    accentLight: '#FFF0ED',
    accentBorder: '#F5C4B8',
    personality: 'Crisp white canvas with a softer coral CTA — clean and approachable.',
    contrastNote: 'Coral on white passes AA for large text; white page maximizes card contrast.',
    isProduction: true,
  },
  {
    id: 'dusk-wine',
    name: 'Dusk Wine',
    page: '#F5F3F0',
    surface: '#FFFFFF',
    border: '#E0DDD8',
    text: '#2E3138',
    muted: '#49505A',
    accent: '#9B4D55',
    accentLight: '#F5ECEE',
    accentBorder: '#D4B0B6',
    personality: 'Muted rose and wine tones — evening gatherings, sophisticated and intimate.',
    contrastNote: 'Wine accent on white passes AA for large text; subdued page feels refined.',
  },
]

export function getColorScheme(id: ColorSchemeId): ColorScheme {
  const scheme = COLOR_SCHEMES.find((entry) => entry.id === id)
  if (!scheme) {
    throw new Error(`Unknown color scheme: ${id}`)
  }
  return scheme
}
