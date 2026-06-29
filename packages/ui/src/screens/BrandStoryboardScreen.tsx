import type { ReactNode } from 'react'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { BackgroundStrategyComparison } from '../components/brand/BackgroundStrategyPreview'
import {
  ColorSchemeComparison,
  type ColorSchemeId,
} from '../components/brand/ColorSchemePreview'
import {
  SidebarChromeComparison,
  type SidebarChromeId,
} from '../components/brand/SidebarChromePreview'
import {
  CampfireEventCard,
  STORYBOARD_EVENT_CARDS,
} from '../components/brand/CampfireEventCard'
import { CampfireLogoLockupGrid } from '../components/brand/CampfireLogoLockup'
import { ElevatedSurface } from '../components/brand/ElevatedSurface'
import { CampfireMark } from '../components/brand/CampfireMark'
import { LegacyFlameGrid } from '../components/brand/LegacyFlameGrid'
import { CampfireLogo } from '../components/CampfireLogo'
import { SelectablePill } from '../components/SelectablePill'
import { SettingsRow, ToggleSwitch } from '../components/EventComponents'
import { PrimaryButton, TextButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { EVENT_TYPE_OPTIONS } from '../lib/eventTypes'

const COLOR_SWATCHES: Array<{
  token: string
  bgClass: string
  hex: string
  label: string
  darkText?: boolean
}> = [
  { token: 'cf-accent', bgClass: 'bg-cf-accent', hex: '#E5634D', label: 'Primary / accent' },
  { token: 'cf-accent-light', bgClass: 'bg-cf-accent-light', hex: '#FFF0ED', label: 'Accent light', darkText: true },
  { token: 'cf-flame-orange', bgClass: 'bg-cf-flame-orange', hex: '#FF8A3D', label: 'Flame mid' },
  { token: 'cf-flame-yellow', bgClass: 'bg-cf-flame-yellow', hex: '#FFC24D', label: 'Flame highlight', darkText: true },
  { token: 'cf-flame-red', bgClass: 'bg-cf-flame-red', hex: '#E5634D', label: 'Flame red' },
  { token: 'cf-cream', bgClass: 'bg-cf-cream', hex: '#FFFFFF', label: 'Cream (legacy)', darkText: true },
  { token: 'cf-page-current', bgClass: 'bg-cf-page-current', hex: '#FFFFFF', label: 'Page — white', darkText: true },
  { token: 'cf-page-neutral', bgClass: 'bg-cf-page-neutral', hex: '#FAFAF8', label: 'Page — neutral', darkText: true },
  { token: 'cf-page-deep', bgClass: 'bg-cf-page-deep', hex: '#F5EDE3', label: 'Page — deep cream', darkText: true },
  { token: 'cf-card', bgClass: 'bg-cf-card', hex: '#FFFFFF', label: 'Card (legacy)', darkText: true },
  { token: 'cf-surface-elevated', bgClass: 'bg-cf-surface-elevated', hex: '#FFFFFF', label: 'Elevated surface', darkText: true },
  { token: 'cf-card-border', bgClass: 'bg-cf-card-border', hex: '#F5C4B8', label: 'Card border', darkText: true },
  { token: 'ig-surface', bgClass: 'bg-ig-surface', hex: '#FFFFFF', label: 'Surface', darkText: true },
  { token: 'ig-text', bgClass: 'bg-ig-text', hex: '#2E3138', label: 'Text primary' },
  { token: 'cf-charcoal', bgClass: 'bg-cf-charcoal', hex: '#2E3138', label: 'Charcoal' },
  { token: 'ig-muted', bgClass: 'bg-ig-muted', hex: '#49505A', label: 'Text muted' },
  { token: 'cf-gray', bgClass: 'bg-cf-gray', hex: '#49505A', label: 'Gray' },
  { token: 'ig-border', bgClass: 'bg-ig-border', hex: '#E8E4E0', label: 'Border', darkText: true },
  { token: 'ig-red', bgClass: 'bg-ig-red', hex: '#ED4956', label: 'Error only' },
]

const TYPOGRAPHY_SAMPLES = [
  { className: 'text-3xl font-bold text-ig-text', label: 'text-3xl bold — page title' },
  { className: 'text-2xl font-semibold text-ig-text', label: 'text-2xl semibold' },
  { className: 'text-xl font-semibold text-ig-text', label: 'text-xl semibold — section' },
  { className: 'text-lg font-semibold text-ig-text', label: 'text-lg semibold' },
  { className: 'text-base text-ig-text', label: 'text-base — body' },
  { className: 'text-sm text-ig-text', label: 'text-sm — default copy' },
  { className: 'text-sm text-ig-muted', label: 'text-sm muted — secondary' },
  { className: 'text-xs font-medium text-ig-muted', label: 'text-xs — labels' },
] as const

const VOICE_PAIRS = [
  {
    onBrand: 'Share this link with everyone who came.',
    offBrand: 'Leverage the platform to onboard users.',
  },
  {
    onBrand: 'Add your photos from tonight.',
    offBrand: 'Upload media assets to the repository.',
  },
  {
    onBrand: 'Name your gathering — we\'ll give you a link and QR to share.',
    offBrand: 'Configure your workspace project name.',
  },
] as const

const BRAND_PILLARS = [
  {
    title: 'Gather',
    description: 'QR codes, join links, and membership bring everyone into one album.',
  },
  {
    title: 'Contribute',
    description: 'Photos, videos, and text posts from every guest who was there.',
  },
  {
    title: 'Relive',
    description: 'Browse the album or watch memories on the photo wall.',
  },
  {
    title: 'Shape',
    description: 'Hosts control moderation and settings without killing the vibe.',
  },
] as const

const BRAND_CHECKLIST = [
  'Page → elevated white cards with warm shadow (not cream-on-cream)',
  'cf-accent for primary actions; warm borders — no cool grays or Instagram blue',
  'Copy is warm, inclusive, and short — no enterprise jargon',
  'Terminology: Campfire / campfire / album / photo wall used consistently',
  'Photos first — UI chrome stays minimal',
  'Messaging emphasizes shared contribution, not solo ownership',
] as const

export function BrandStoryboardScreen() {
  const [demoText, setDemoText] = useState('Summer BBQ 2026')
  const [toggleOn, setToggleOn] = useState(true)
  const [selectedType, setSelectedType] = useState<(typeof EVENT_TYPE_OPTIONS)[number]['id']>('party')
  const [highlightedSchemeId, setHighlightedSchemeId] = useState<ColorSchemeId | null>(null)
  const [highlightedSidebarId, setHighlightedSidebarId] = useState<SidebarChromeId | null>(null)

  return (
    <ScrollView className="flex-1 bg-ig-page">
      <View className="max-w-[1100px] w-full px-4 py-8 gap-10 self-center">
        <View className="gap-2">
          <Text className="text-xs font-semibold text-cf-accent uppercase tracking-wide">
            Brand storyboard
          </Text>
          <Text className="text-3xl font-bold text-ig-text">Campfire</Text>
          <Text className="text-lg font-semibold text-ig-text">Gather. Share. Relive.</Text>
          <Text className="text-sm text-ig-muted max-w-xl">
            To turn fleeting moments at gatherings into a shared story everyone helped tell —
            so memories feel collective, not solitary.
          </Text>
          <Text className="text-xs text-ig-muted max-w-xl mt-2">
            Explore color schemes, sidebar chrome, and page backgrounds here — pick directions on
            this page, then we roll winners out app-wide.
          </Text>
        </View>

        <Section title="Color scheme exploration">
          <Text className="text-sm text-ig-muted">
            Six full palettes side by side — page, accent, cards, and controls together. Click a
            panel to highlight a favorite while you compare. Production today is Coral Bloom.
          </Text>
          <Text className="text-xs text-ig-muted">
            Compare page warmth, CTA feel, and card contrast together — not just the background
            alone.
          </Text>
          <ColorSchemeComparison
            highlightedSchemeId={highlightedSchemeId}
            onHighlightScheme={(id) =>
              setHighlightedSchemeId((current) => (current === id ? null : id))
            }
          />
        </Section>

        <Section title="Sidebar chrome exploration">
          <Text className="text-sm text-ig-muted">
            With a white page under Coral Bloom, the left nav needs its own surface to anchor the
            shell. Nine treatments grouped by style — click to highlight a favorite. Desktop
            sidebar only; mobile tab bar unchanged.
          </Text>
          <Text className="text-xs text-ig-muted">
            Try <Text className="font-semibold text-ig-text">Warm solid</Text> for red and orange
            sidebars, or <Text className="font-semibold text-ig-text">Dark anchor</Text> for
            charcoal — compare separation from content and active-state clarity.
          </Text>
          <SidebarChromeComparison
            highlightedId={highlightedSidebarId}
            onHighlight={(id) =>
              setHighlightedSidebarId((current) => (current === id ? null : id))
            }
          />
        </Section>

        <Section title="Background strategies">
          <Text className="text-sm text-ig-muted">
            Page-neutral options only — accent stays orange. Use the color scheme section above for
            full palette decisions including accent color.
          </Text>
          <BackgroundStrategyComparison />
        </Section>

        <Section title="Campfire mark">
          <Text className="text-sm text-ig-muted">
            Production logo: flame rising from shared photo tiles and memory sparks. Solid SVG
            fills — SSR-safe.
          </Text>
          <View className="flex-row flex-wrap gap-8 items-center">
            <View className="gap-2 items-center">
              <CampfireLogo size="sm" layout="horizontal" />
              <CampfireLogo size="md" layout="horizontal" />
              <CampfireLogo size="lg" layout="stacked" />
              <Text className="text-xs text-ig-muted">Sidebar / auth / hero</Text>
            </View>
          </View>
        </Section>

        <Section title="Logo lockups">
          <Text className="text-sm text-ig-muted">
            Four concepts for selection. Production UI still uses wordmark-only until you pick a
            winner. Clear space: height of the flame mark on all sides. Minimum width: 80px
            wordmark on web.
          </Text>
          <CampfireLogoLockupGrid size="md" />
          <View className="mt-4 rounded-xl bg-cf-charcoal p-6 gap-4">
            <Text className="text-xs text-white/70">Dark theme (photo wall, fullscreen)</Text>
            <CampfireLogoLockupGrid theme="dark" size="md" />
          </View>
          <View className="flex-row flex-wrap gap-8 items-end mt-4">
            <LogoSample label="sm (production wordmark)" size="sm" />
            <LogoSample label="md" size="md" />
            <LogoSample label="lg" size="lg" />
          </View>
        </Section>

        <Section title="Event cards">
          <Text className="text-sm text-ig-muted">
            Current My Events cards vs proposed designs. Selected for rollout: warm header band.
          </Text>
          <View className="gap-6">
            <View className="gap-3">
              <Text className="text-sm font-semibold text-cf-accent">
                Selected — warm header band
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {STORYBOARD_EVENT_CARDS.map((event) => (
                  <CampfireEventCard key={event.name} event={event} style="warm-header" />
                ))}
              </View>
            </View>
            <View className="gap-3">
              <Text className="text-sm font-semibold text-ig-muted">Previous — cream on cream</Text>
              <View className="flex-row flex-wrap gap-4">
                {STORYBOARD_EVENT_CARDS.map((event) => (
                  <CampfireEventCard key={event.name} event={event} style="legacy" />
                ))}
              </View>
            </View>
            <View className="gap-3">
              <Text className="text-sm font-semibold text-ig-muted">
                Alternative — elevated white + theme stripe
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {STORYBOARD_EVENT_CARDS.map((event) => (
                  <CampfireEventCard key={event.name} event={event} style="elevated" />
                ))}
              </View>
            </View>
          </View>
        </Section>

        <Section title="Surface and elevation">
          <Text className="text-sm text-ig-muted mb-2">
            Intended hierarchy: warm page → white elevated surface → accent stripe or badge.
            Shadow via ElevatedSurface (warm rgba, RN-web safe).
          </Text>
          <View className="flex-row flex-wrap gap-4">
            <SurfaceSample pageClass="bg-cf-page-current" label="Page — warm cream" />
            <SurfaceSample pageClass="bg-cf-page-neutral" label="Page — neutral" />
            <SurfaceSample pageClass="bg-cf-page-deep" label="Page — deep cream" />
            <SurfaceSample pageClass="bg-ig-surface" label="Sidebar / chrome" bordered />
            <SurfaceSample pageClass="bg-cf-surface-elevated" label="Elevated card" elevated bordered />
          </View>
        </Section>

        <Section title="Flame mark (legacy comparison)">
          <Text className="text-sm text-ig-muted">
            Replaced tile grids in auth, marketing, and skeletons with CampfireMark.
          </Text>
          <View className="flex-row flex-wrap gap-8 items-center">
            <View className="gap-2 items-center">
              <CampfireMark size="sm" />
              <CampfireMark size="md" />
              <CampfireMark size="lg" />
              <Text className="text-xs text-ig-muted">CampfireMark (production)</Text>
            </View>
            <View className="gap-2 items-center">
              <LegacyFlameGrid variant="gradient" />
              <Text className="text-xs text-ig-muted">Legacy — auth (gradient tiles)</Text>
            </View>
            <View className="gap-2 items-center">
              <LegacyFlameGrid variant="flat" />
              <Text className="text-xs text-ig-muted">Legacy — marketing (flat tiles)</Text>
            </View>
          </View>
        </Section>

        <Section title="Logo (production wordmark)">
          <View className="flex-row flex-wrap gap-8 items-end">
            <LogoSample label="sm" size="sm" />
            <LogoSample label="md" size="md" />
            <LogoSample label="lg" size="lg" />
          </View>
          <View className="mt-6 rounded-xl bg-cf-charcoal p-6 gap-2">
            <Text className="text-xs text-white/70">Dark theme (photo wall)</Text>
            <CampfireLogo size="md" theme="dark" />
          </View>
        </Section>

        <Section title="Color palette">
          <Text className="text-sm text-ig-muted mb-2">
            Uniwind classes from packages/ui/src/global.css
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {COLOR_SWATCHES.map((swatch) => (
              <ColorSwatch key={swatch.token} {...swatch} />
            ))}
          </View>
        </Section>

        <Section title="Typography">
          <View className="gap-4 border border-ig-border rounded-xl bg-ig-surface p-6">
            {TYPOGRAPHY_SAMPLES.map((sample) => (
              <View key={sample.label} className="gap-1">
                <Text className={sample.className}>The album you build together</Text>
                <Text className="text-xs text-ig-muted font-mono">{sample.label}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Motion and interaction">
          <Text className="text-sm text-ig-muted mb-2">
            Hover, press, and focus feedback on web. Toggle animates over 200ms. Respects
            prefers-reduced-motion.
          </Text>
          <View className="gap-6 border border-ig-border rounded-xl bg-ig-surface p-6">
            <View className="flex-row flex-wrap gap-4 items-center">
              <PrimaryButton label="Primary — hover me" onPress={() => {}} />
              <PrimaryButton label="Secondary" variant="secondary" onPress={() => {}} />
              <TextButton label="Text link" onPress={() => {}} />
            </View>
            <SettingsRow
              title="Animated toggle"
              description="Track color and thumb slide smoothly."
              control={<ToggleSwitch value={toggleOn} onChange={setToggleOn} />}
            />
            <View className="flex-row flex-wrap gap-2">
              {EVENT_TYPE_OPTIONS.slice(0, 3).map((type) => (
                <SelectablePill
                  key={type.id}
                  label={type.label}
                  emoji={type.emoji}
                  selected={selectedType === type.id}
                  onPress={() => setSelectedType(type.id)}
                />
              ))}
            </View>
          </View>
        </Section>

        <Section title="Buttons and links">
          <View className="flex-row flex-wrap gap-4 items-center">
            <PrimaryButton label="Create Event" onPress={() => {}} />
            <PrimaryButton label="Secondary" variant="secondary" onPress={() => {}} />
            <TextButton label="View all campfires" onPress={() => {}} />
            <Text className="text-sm font-semibold text-cf-accent">Accent link</Text>
          </View>
        </Section>

        <Section title="Form controls">
          <View className="max-w-md gap-4">
            <TextField
              label="Event name"
              value={demoText}
              onChangeText={setDemoText}
              placeholder="Summer BBQ 2026"
            />
            <SettingsRow
              title="Require approval"
              description="Review uploads before they appear on the wall."
              control={<ToggleSwitch value={toggleOn} onChange={setToggleOn} />}
            />
          </View>
        </Section>

        <Section title="Event type pills">
          <View className="flex-row flex-wrap gap-2">
            {EVENT_TYPE_OPTIONS.map((type) => (
              <SelectablePill
                key={type.id}
                label={type.label}
                emoji={type.emoji}
                selected={selectedType === type.id}
                onPress={() => setSelectedType(type.id)}
              />
            ))}
          </View>
        </Section>

        <Section title="Voice and copy">
          <View className="gap-4">
            {VOICE_PAIRS.map((pair) => (
              <View
                key={pair.onBrand}
                className="border border-ig-border rounded-xl bg-ig-surface overflow-hidden"
              >
                <View className="px-4 py-3 border-b border-ig-border bg-cf-accent-light">
                  <Text className="text-xs font-semibold text-cf-accent mb-1">On brand</Text>
                  <Text className="text-sm text-ig-text">{pair.onBrand}</Text>
                </View>
                <View className="px-4 py-3">
                  <Text className="text-xs font-semibold text-ig-muted mb-1">Avoid</Text>
                  <Text className="text-sm text-ig-muted">{pair.offBrand}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Logged-out home">
          <Text className="text-sm text-ig-muted mb-4">
            Marketing hero at / — tagline, pillars, and sign-in CTA.
          </Text>
          <View className="border border-cf-card-border rounded-xl bg-cf-card p-6 gap-4 max-w-lg">
            <Text className="text-3xl font-bold text-ig-text">Gather. Share. Relive.</Text>
            <Text className="text-xl text-ig-muted">The album you build together.</Text>
            <Text className="text-sm text-ig-muted">
              Shared albums for the people who were there.
            </Text>
            <View className="flex-row flex-wrap gap-3 pt-2">
              {['Gather', 'Share', 'Relive'].map((pillar) => (
                <View
                  key={pillar}
                  className="border border-ig-border rounded-lg bg-ig-surface px-3 py-2"
                >
                  <Text className="text-sm font-semibold text-cf-accent">{pillar}</Text>
                </View>
              ))}
            </View>
            <PrimaryButton label="Sign in" onPress={() => {}} />
          </View>
        </Section>

        <Section title="Brand pillars">
          <View className="flex-row flex-wrap gap-4">
            {BRAND_PILLARS.map((pillar) => (
              <View
                key={pillar.title}
                className="flex-1 min-w-[220px] border border-cf-card-border rounded-xl bg-cf-card p-5 gap-2"
              >
                <Text className="text-lg font-semibold text-cf-accent">{pillar.title}</Text>
                <Text className="text-sm text-ig-muted">{pillar.description}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Brand checklist">
          <View className="border border-ig-border rounded-xl bg-ig-surface p-6 gap-3">
            {BRAND_CHECKLIST.map((item) => (
              <View key={item} className="flex-row gap-3">
                <Text className="text-cf-accent font-bold">—</Text>
                <Text className="text-sm text-ig-text flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Text className="text-xs text-ig-muted pb-8">
          Reference: docs/BRAND.md · docs/UX-FOUNDATION.md
        </Text>
      </View>
    </ScrollView>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4">
      <Text className="text-xl font-semibold text-ig-text border-b border-ig-border pb-2">
        {title}
      </Text>
      {children}
    </View>
  )
}

function LogoSample({
  label,
  size,
}: {
  label: string
  size: 'sm' | 'md' | 'lg'
}) {
  return (
    <View className="gap-2 items-start">
      <CampfireLogo size={size} />
      <Text className="text-xs text-ig-muted">{label}</Text>
    </View>
  )
}

function ColorSwatch({
  token,
  bgClass,
  hex,
  label,
}: {
  token: string
  bgClass: string
  hex: string
  label: string
  darkText?: boolean
}) {
  return (
    <View className="w-[140px] gap-1">
      <View className={`h-16 rounded-lg border border-ig-border ${bgClass}`} />
      <Text className="text-xs font-semibold text-ig-text">{label}</Text>
      <Text className="text-xs text-ig-muted font-mono">{token}</Text>
      <Text className="text-xs text-ig-muted">{hex}</Text>
    </View>
  )
}

function SurfaceSample({
  pageClass,
  label,
  elevated,
  bordered,
}: {
  pageClass: string
  label: string
  elevated?: boolean
  bordered?: boolean
}) {
  const inner = (
    <View
      className={`h-20 w-36 rounded-lg items-center justify-center ${pageClass} ${
        bordered ? 'border border-ig-border' : ''
      }`}
    >
      <Text className="text-xs text-ig-muted text-center px-2">{label}</Text>
    </View>
  )

  return elevated ? (
    <ElevatedSurface className="rounded-lg">{inner}</ElevatedSurface>
  ) : (
    inner
  )
}
