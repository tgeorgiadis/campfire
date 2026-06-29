# Campfire UX Foundation

Technical architecture and layout system for Campfire. Complements [`BRAND.md`](BRAND.md) (strategy and voice) with implementable structure for developers and agents.

**Live storyboard:** run the app and open [`/brand`](/brand) to preview tokens and components. The **Color scheme exploration** section shows six full palettes (page + accent + surfaces) side by side — use it to pick a direction before updating `global.css`.

---

## Design tokens (Uniwind)

All tokens live in `packages/ui/src/global.css` inside the Tailwind v4 `@theme` block. The web app loads this file via Uniwind in `apps/web/vite.config.ts`:

```ts
uniwind({
  cssEntryFile: '../../packages/ui/src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
})
```

Use tokens as Tailwind classes on React Native `View` / `Text` (`className="bg-cf-accent"`). Do not add parallel CSS files for app UI.

| Role | Class prefix | Example |
|------|--------------|---------|
| Brand accent | `cf-accent`, `cf-accent-light` | `bg-cf-accent`, `text-cf-accent` |
| Flame palette | `cf-flame-*` | `bg-cf-flame-orange` |
| Page background | `ig-page`, `cf-cream`, `cf-page-*` | `bg-ig-page`, `bg-cf-page-neutral` |
| Surfaces | `ig-surface`, `cf-surface-elevated` | `bg-ig-surface` |
| Legacy card (avoid) | `cf-card` | Same hex as page — use elevated white instead |
| Text | `ig-text`, `ig-muted` | `text-ig-text` |
| Borders | `ig-border`, `cf-card-border` | `border-ig-border` |
| Elevation | `CF_SHADOW_SM` via `ElevatedSurface` | Warm rgba shadow — not a Tailwind class |
| Error | `ig-red` | `text-ig-red` (errors only) |

See [`BRAND.md`](BRAND.md) for hex values and usage rules.

---

## Spacing system

4px base grid via Tailwind spacing utilities:

| Scale | Class | Size |
|-------|-------|------|
| xs | `gap-1`, `p-1` | 4px |
| sm | `gap-2`, `p-2` | 8px |
| md | `gap-4`, `p-4` | 16px |
| lg | `gap-6`, `p-6` | 24px |
| xl | `gap-8`, `p-8` | 32px |

Common patterns: section `gap-6`, card `p-6`, form fields `gap-4`, compact labels `gap-1`.

---

## Typography

System sans via `font-sans` (defined in `@theme`).

| Level | Class | Usage |
|-------|-------|-------|
| Page title | `text-3xl font-bold` | My Events, dashboard name |
| Section title | `text-xl font-semibold` | Card titles |
| Subsection | `text-lg font-semibold` | Storyboard sections |
| Body | `text-sm` | Default copy |
| Label | `text-xs font-medium text-ig-muted` | Form labels |
| Muted body | `text-sm text-ig-muted` | Descriptions |

Logo wordmark sizes: `CampfireLogo` `sm` / `md` / `lg` in `CampfireLogo.tsx`.

---

## Layout framework

### Containers

| Context | Max width | Padding |
|---------|-----------|---------|
| Event content | `max-w-[1100px] w-full px-4 py-6` | EventShell main |
| App shell (legacy) | `max-w-[1200px]` | AppShell |
| Brand storyboard | `max-w-[1100px] px-4 py-8` | `/brand` |
| Startup wizard card | `max-w-[420px]` | First-time create |

### Shells

- **EventShell** — fixed 260px sidebar (desktop), bottom tabs (mobile), white page (Coral Bloom). Sidebar chrome options on `/brand` → Sidebar chrome exploration
- **AppShell** — 244px sidebar (legacy profile/create)
- **Photo wall** — fullscreen black, minimal floating chrome

### Grid patterns

- Event cards: `flex-row flex-wrap gap-4`, `w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]`
- Event card component: `CampfireEventCard` in `packages/ui/src/components/brand/` (storyboard + Phase 2 rollout)
- Color swatches: `flex-row flex-wrap gap-3`
- Event type pills: `flex-row flex-wrap gap-2`

### CampfireEventCard (preview)

Used on `/brand` for design exploration; replaces inline cards in My Events during Phase 2.

| Style | Description |
|-------|-------------|
| `elevated` | White surface, warm shadow, optional theme stripe, inline current badge |
| `warm-header` | Accent-light header band with emoji + title |
| `legacy` | Current production — cream card on cream page (deprecated) |

**Content order:** emoji + name → event date → upload count → created date.

**Current event:** `rounded-full bg-cf-accent-light px-2.5 py-1` pill — never a full-width footer (keeps grid even).

### Elevation

Card shadow uses `ElevatedSurface` with `CF_SHADOW_SM` from `brandShadow.ts`:

```ts
'0 1px 3px rgba(46, 49, 56, 0.08), 0 1px 2px rgba(255, 94, 58, 0.06)'
```

Do not use `bg-gradient-*` for brand marks (SSR crash with react-native-web). Use `FlameMark` solid fills instead.

### Breakpoints

- `md:` — sidebar visible, mobile header hidden (768px+)
- Mobile-first: default single column; enhance at `md`

---

## Motion

Shared motion tokens live in `packages/ui/src/global.css` and reusable class strings in `packages/ui/src/components/motion/motionClasses.ts`.

### Durations and easing

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Buttons, links, pills, grid tiles |
| `--duration-normal` | `200ms` | Toggles, tabs, cards |
| `--duration-slow` | `300ms` | Modals, overlays |
| `--ease-out` | `cubic-bezier(0.33, 1, 0.68, 1)` | Default easing |

Tailwind: `duration-150`, `duration-200`, `ease-out` on interactive elements.

### Interaction states

| State | Rule |
|-------|------|
| **Hover** (web) | Subtle opacity, background, or shadow shift — never jarring color jumps |
| **Active / press** | `active:scale-[0.98]` on buttons; `active:scale-[0.99]` on large cards |
| **Focus** | `focus-visible:outline-2 outline-cf-accent outline-offset-2` for keyboard users |
| **Disabled** | `opacity-50`, no hover feedback |

Use `PrimaryButton`, `TextButton`, `SelectablePill`, and `ToggleSwitch` as reference implementations.

### Reduced motion

A global `@media (prefers-reduced-motion: reduce)` rule shortens all transitions and animations to ~0ms. Do not bypass this with inline animation durations.

### Toggle animation

`ToggleSwitch` uses React Native `Animated.timing` (not Reanimated) for thumb slide and track color over 200ms — SSR-safe.

---

## Component hierarchy

1. **Layout** — `EventShell`, `AppShell`, `ModalFrame`
2. **Content** — `DashboardCard`, `MediaGrid`, `PhotoWallScreen`
3. **Interactive** — `PrimaryButton`, `TextField`, `ToggleSwitch`, `SelectablePill`, `SettingsRow`
4. **Brand** — `CampfireLogo`
5. **Tokens** — `className` only; no inline hex in feature code

Import from `@campfire/ui`.

---

## Theme strategy

- **App chrome:** warm cream light theme (`bg-ig-page`)
- **Photo wall / TV:** dark background, photos as hero; UI chrome auto-hides
- **No app-wide dark mode** today (future: optional `data-theme` if needed)

Event hosts can set per-campfire `themeColor` (default `#FF5E3A`) for guest album accents.

---

## Accessibility baseline

- Body text: `text-ig-text` on `bg-ig-page` (charcoal on cream)
- Primary buttons: white text on `bg-cf-accent` (or `bg-ig-blue` alias)
- Muted text: `text-ig-muted` for secondary only, not long paragraphs
- Interactive targets: min ~44px touch height on mobile tabs and buttons
- Photo wall: keyboard-accessible top bar when visible

---

## Information architecture (signed-in host)

```
EventShell
├── Current Event (switcher, View All, Create)
├── Home — share album / wall links
├── Photos and Videos — upload, moderate
├── Event Settings — appearance, wall, moderation
└── My Account — sign out

/brand — design reference (no nav shell)
```

---

## Implementation priority (new UI)

1. Confirm tokens exist in `global.css` (add to `@theme` if new)
2. Update `/brand` storyboard swatches if tokens change
3. Build with `@campfire/ui` components and Uniwind classes
4. Use `ElevatedSurface` for card elevation; prefer white cards on warm page
5. Run brand checklist in [`BRAND.md`](BRAND.md)
6. `bun run lint`

---

## Related skills

- **brand-guardian** — strategy, voice, terminology
- **ux-architect** — this doc’s patterns and handoff templates
- **ui-designer** — visual systems, logo lockups, card elevation, `/brand` exploration

*Last updated: UX foundation v1.*
