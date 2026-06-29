export type SidebarChromeId =
  | 'current-flat'
  | 'coral-wash'
  | 'warm-stone'
  | 'soft-blush'
  | 'charcoal-anchor'
  | 'coral-bold'
  | 'ember-orange'
  | 'terracotta-solid'
  | 'deep-rust'

export type SidebarChromeGroup = 'neutral' | 'warm-solid' | 'dark'

export type SidebarChromeStrategy = {
  id: SidebarChromeId
  name: string
  group: SidebarChromeGroup
  sidebar: string
  sidebarBorder: string
  navText: string
  navMuted: string
  navActiveBg: string
  navActiveText: string
  eventBlockBg: string
  eventBlockBorder: string
  logoTheme: 'light' | 'dark'
  logoColor: string
  accentColor: string
  personality: string
  contrastNote: string
  isProduction?: boolean
}

export const SIDEBAR_CHROME_GROUP_LABELS: Record<SidebarChromeGroup, string> = {
  neutral: 'Light & tinted',
  'warm-solid': 'Warm solid — red & orange',
  dark: 'Dark anchor',
}

export const SIDEBAR_CHROME_STRATEGIES: SidebarChromeStrategy[] = [
  {
    id: 'current-flat',
    name: 'Flat white (today)',
    group: 'neutral',
    sidebar: '#FFFFFF',
    sidebarBorder: '#E8E4E0',
    navText: '#2E3138',
    navMuted: '#49505A',
    navActiveBg: '#FFF0ED',
    navActiveText: '#E5634D',
    eventBlockBg: '#FFFFFF',
    eventBlockBorder: '#E8E4E0',
    logoTheme: 'light',
    logoColor: '#2E3138',
    accentColor: '#E5634D',
    personality: 'Sidebar matches the page — minimal separation, border only.',
    contrastNote: 'Baseline production under Coral Bloom; relies on border-r for structure.',
  },
  {
    id: 'coral-wash',
    name: 'Coral wash',
    group: 'neutral',
    sidebar: '#FFF0ED',
    sidebarBorder: '#F5C4B8',
    navText: '#2E3138',
    navMuted: '#49505A',
    navActiveBg: '#FFFFFF',
    navActiveText: '#E5634D',
    eventBlockBg: '#FFFFFF',
    eventBlockBorder: '#F5C4B8',
    logoTheme: 'light',
    logoColor: '#2E3138',
    accentColor: '#E5634D',
    personality: 'Soft coral tint anchors the nav without going dark — on-brand and solid.',
    contrastNote: 'Sidebar tint passes AA for charcoal text; active white pill reads clearly.',
  },
  {
    id: 'warm-stone',
    name: 'Warm stone',
    group: 'neutral',
    sidebar: '#F5F3F0',
    sidebarBorder: '#E8E4E0',
    navText: '#2E3138',
    navMuted: '#49505A',
    navActiveBg: '#FFFFFF',
    navActiveText: '#E5634D',
    eventBlockBg: '#FFFFFF',
    eventBlockBorder: '#E8E4E0',
    logoTheme: 'light',
    logoColor: '#2E3138',
    accentColor: '#E5634D',
    personality: 'Neutral warm gray sidebar — strong separation from white content, calm anchor.',
    contrastNote: 'Stone sidebar vs white page creates clear hierarchy without color competition.',
  },
  {
    id: 'soft-blush',
    name: 'Soft blush border',
    group: 'neutral',
    sidebar: '#FFF0ED',
    sidebarBorder: '#F5C4B8',
    navText: '#2E3138',
    navMuted: '#49505A',
    navActiveBg: '#FFFFFF',
    navActiveText: '#E5634D',
    eventBlockBg: '#FFFFFF',
    eventBlockBorder: '#F5C4B8',
    logoTheme: 'light',
    logoColor: '#2E3138',
    accentColor: '#E5634D',
    personality: 'Coral wash plus warm border — layered warmth; inset cards pop on white.',
    contrastNote: 'Accent border reinforces sidebar edge; current-event block lifts on white inset.',
  },
  {
    id: 'coral-bold',
    name: 'Coral bold',
    group: 'warm-solid',
    sidebar: '#E5634D',
    sidebarBorder: '#D04A38',
    navText: '#FFFFFF',
    navMuted: '#FFD9D0',
    navActiveBg: '#FFFFFF',
    navActiveText: '#E5634D',
    eventBlockBg: '#D04A38',
    eventBlockBorder: '#C84332',
    logoTheme: 'dark',
    logoColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    personality: 'Production coral as sidebar fill — unmistakably Campfire, white nav labels.',
    contrastNote: 'White text on coral passes AA for large/bold nav; active white pill pops.',
    isProduction: true,
  },
  {
    id: 'ember-orange',
    name: 'Ember orange',
    group: 'warm-solid',
    sidebar: '#FF5E3A',
    sidebarBorder: '#E85530',
    navText: '#FFFFFF',
    navMuted: '#FFE0D6',
    navActiveBg: '#FFFFFF',
    navActiveText: '#FF5E3A',
    eventBlockBg: '#E85530',
    eventBlockBorder: '#D94E28',
    logoTheme: 'dark',
    logoColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    personality: 'Classic ember orange sidebar — high energy, flame-forward brand presence.',
    contrastNote: 'White nav on ember orange passes AA for large text; strongest warm statement.',
  },
  {
    id: 'terracotta-solid',
    name: 'Terracotta solid',
    group: 'warm-solid',
    sidebar: '#C84B31',
    sidebarBorder: '#B0432A',
    navText: '#FFFFFF',
    navMuted: '#F0D0C8',
    navActiveBg: '#FFFFFF',
    navActiveText: '#C84B31',
    eventBlockBg: '#B0432A',
    eventBlockBorder: '#9A3B24',
    logoTheme: 'dark',
    logoColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    personality: 'Burnt terracotta sidebar — earthy red-orange, mature and grounded.',
    contrastNote: 'Deeper hue improves white-text contrast vs bright coral; less neon.',
  },
  {
    id: 'deep-rust',
    name: 'Deep rust',
    group: 'warm-solid',
    sidebar: '#A84838',
    sidebarBorder: '#953F32',
    navText: '#FFFFFF',
    navMuted: '#E8C4BC',
    navActiveBg: '#FFFFFF',
    navActiveText: '#A84838',
    eventBlockBg: '#953F32',
    eventBlockBorder: '#84382C',
    logoTheme: 'dark',
    logoColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    personality: 'Darkest warm red sidebar — rich rust anchor closest to charcoal weight.',
    contrastNote: 'Best white-text contrast in the warm-solid group; pairs with white page.',
  },
  {
    id: 'charcoal-anchor',
    name: 'Charcoal anchor',
    group: 'dark',
    sidebar: '#2E3138',
    sidebarBorder: '#3D4249',
    navText: '#FFFFFF',
    navMuted: '#A8ADB4',
    navActiveBg: '#FFF0ED',
    navActiveText: '#E5634D',
    eventBlockBg: '#3D4249',
    eventBlockBorder: '#4A5058',
    logoTheme: 'dark',
    logoColor: '#FFFFFF',
    accentColor: '#E5634D',
    personality: 'Bold dark chrome — stable anchor that echoes photo-wall fullscreen mode.',
    contrastNote: 'White nav text on charcoal passes AA; coral active pill stays visible.',
  },
]

export function getSidebarChromeStrategy(id: SidebarChromeId): SidebarChromeStrategy {
  const strategy = SIDEBAR_CHROME_STRATEGIES.find((entry) => entry.id === id)
  if (!strategy) {
    throw new Error(`Unknown sidebar chrome strategy: ${id}`)
  }
  return strategy
}

export const SIDEBAR_CHROME_GROUPS: SidebarChromeGroup[] = ['neutral', 'warm-solid', 'dark']
