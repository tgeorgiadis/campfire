# Campfire Brand Identity System

Campfire is a shared photo album for groups — a "group Instagram" where hosts create **campfires** (albums) and guests contribute via QR code or membership. This document is the single source of truth for brand strategy, visual identity, and voice.

**Tagline:** Gather. Share. Relive.

**Live storyboard:** run the app and open `/brand` to preview colors, typography, components, and voice in one place. See also [`UX-FOUNDATION.md`](UX-FOUNDATION.md) for layout and token implementation details.

---

## Brand Strategy

### Purpose

To turn fleeting moments at gatherings into a shared story everyone helped tell — so memories feel collective, not solitary.

### Vision

Every meaningful get-together has a living album built by the people who were there, easy to gather around again and again.

### Mission

Campfire gives hosts and guests a simple way to collect, share, and relive photos and videos from weddings, parties, and events — without friction, without gatekeeping the fun.

### Brand Promise

**Everyone who was there can add to the story.** Setup is quick, sharing is effortless, and the album feels like the group's — not the app's.

### Values

| Value | Meaning | In product |
|-------|---------|------------|
| **Together** | Memories belong to the group | QR join, co-upload, photo wall as shared focal point |
| **Warm** | Inviting, human, never cold or corporate | Cream UI, flame accent, friendly copy |
| **Effortless** | Get going in minutes | Startup wizard, scan-and-upload, TV wall |
| **Inclusive** | Every guest can participate | Guest links, optional moderation without exclusion |
| **Playful** | Light, celebratory, not stiff | Fun microcopy, event-type emojis, relaxed tone |

### Personality

- **Warm host** — welcomes everyone to the circle
- **Playful friend** — celebrates the moment, not the software
- **Calm organizer** — reliable when hosts need control (settings, moderation)
- **Memory keeper** — gentle emphasis on nostalgia and "look what we made together"

### Positioning

**Target audiences**

1. **Hosts** (primary): People planning weddings, parties, reunions, conferences who want one shared album
2. **Guests** (secondary): Attendees who scan a QR and contribute in seconds
3. **Display context** (tertiary): Photo wall at the venue — the campfire as a living centerpiece

**Differentiation**

- Not a generic cloud drive — **built for the moment of the event**
- Not a solo feed — **multi-contributor by design**
- Not cold SaaS — **gathering metaphor** (campfire = warmth + circle + stories)

**Positioning statement**

For people who celebrate together, Campfire is the shared photo album that lets every guest add to the memory — unlike generic galleries or solo social feeds, it's built for the circle, not the individual.

**Brand pillars**

1. **Gather** — QR, join links, membership
2. **Contribute** — upload photos, video, text posts
3. **Relive** — album browsing, photo wall slideshow
4. **Shape** — host controls without killing the vibe

---

## Visual Identity

Tokens are defined in `packages/ui/src/global.css` and exposed as Tailwind classes (e.g. `bg-cf-accent`, `text-ig-muted`).

### Color system

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Primary / Accent | `cf-accent` | `#E5634D` | CTAs, links, active nav, flame core (Coral Bloom) |
| Accent light | `cf-accent-light` | `#FFF0ED` | Badges, selected pills, subtle highlights |
| Flame mid | `cf-flame-orange` | `#FF8A3D` | Gradients, illustrations, secondary emphasis |
| Flame highlight | `cf-flame-yellow` | `#FFC24D` | Warm accents, celebratory moments |
| Flame red (alias) | `cf-flame-red` | `#FF5E3A` | Same as accent; use for flame imagery |
| Page / warmth | `cf-cream` / `ig-page` | `#FFFFFF` | App background — crisp white (Coral Bloom) |
| Page preview — neutral | `cf-page-neutral` | `#FAFAF8` | Storyboard option: softer warm white |
| Page preview — deep | `cf-page-deep` | `#F5EDE3` | Storyboard option: richer cream |
| Card surface (legacy) | `cf-card` | `#FFF7EC` | **Deprecated for cards** — same hex as page; use elevated white |
| Elevated surface | `cf-surface-elevated` / `ig-surface` | `#FFFFFF` | Cards, modals, sidebar — white on warm page |
| Card border | `cf-card-border` | `#F5C4B8` | Warm card outlines |
| Text primary | `ig-text` / `cf-charcoal` | `#2E3138` | Headlines, body |
| Text muted | `ig-muted` / `cf-gray` | `#49505A` | Secondary copy |
| Border | `ig-border` | `#E8E4E0` | Dividers — warm gray, not cool gray |
| Error | `ig-red` | `#ED4956` | Errors only — do not use for brand accent |

**Accessibility:** Primary CTA `#E5634D` on white passes AA for large text. Use `cf-charcoal` text on white for body. White text on `cf-accent` for buttons.

**Do not:** Introduce cool blues/grays as brand colors. Do not use `ig-red` or error colors for marketing accents.

### CSS token reference

```css
/* packages/ui/src/global.css — @theme block */
--color-cf-flame-yellow: #ffc24d;
--color-cf-flame-orange: #ff8a3d;
--color-cf-flame-red: #ff5e3a;
--color-cf-charcoal: #2e3138;
--color-cf-gray: #49505a;
--color-cf-cream: #fff7ec;
--color-ig-page: #fff7ec;
--color-ig-surface: #ffffff;
--color-ig-border: #e8dfd4;
--color-ig-text: #2e3138;
--color-ig-muted: #49505a;
--color-ig-red: #ed4956;
--color-cf-accent: #ff5e3a;
--color-cf-accent-light: #fff0e6;
--color-cf-card: #fff7ec;
--color-cf-card-border: #ffd4b8;
--color-cf-page-current: #fff7ec;
--color-cf-page-neutral: #fafaf8;
--color-cf-page-deep: #f5ede3;
--color-cf-surface-elevated: #ffffff;
```

Default event theme color in the backend: `#E5634D` (`packages/backend/convex/lib/defaults.ts`).

**Production palette:** Coral Bloom (`coral-bloom` on `/brand`) — white page, coral accent, warm borders.

### Surface hierarchy

Today’s production UI uses `cf-card` and `ig-page` at the **same hex** (`#FFF7EC`), so cards read flat. The intended hierarchy:

```
Warm page (cf-page-*) → Elevated white surface (ig-surface) → Accent stripe / badge
```

| Layer | Token | Usage |
|-------|-------|-------|
| Page | `ig-page` / `cf-page-current` | App background, shell content area |
| Chrome | `ig-surface` | Sidebar, headers, modals |
| Elevated card | `ig-surface` + warm shadow | Event cards, dashboard cards |
| Accent | `cf-accent`, `cf-accent-light` | CTAs, current-event badge, nav active |

Shadow is applied via `ElevatedSurface` (`CF_SHADOW_SM` in `packages/ui/src/components/brand/brandShadow.ts`) — not a Tailwind class (RN-web safe).

**Motion:** Interactions should feel warm and fluid — gentle hover lifts, smooth toggle slides, and press feedback — not stiff enterprise SaaS. See `docs/UX-FOUNDATION.md` (Motion section) for durations and reduced-motion rules.

### Color scheme exploration (storyboard)

Six full palettes are previewed side by side on `/brand`. **Coral Bloom** is production today; others remain available for comparison.

| ID | Name | Page | Accent | Personality |
|----|------|------|--------|-------------|
| `coral-bloom` | Coral Bloom | `#FFFFFF` | `#E5634D` | Crisp white page, softer coral CTA (production) |
| `ember-classic` | Ember Classic | `#FFF7EC` | `#FF5E3A` | Firelight on faces — warm, energetic |
| `clean-stone` | Clean Stone | `#F8F7F5` | `#FF5E3A` | Same accent, calmer stone page — less yellow |
| `terracotta-dusk` | Terracotta Dusk | `#F4EFEA` | `#C84B31` | Earthy burnt orange — grounded, less neon |
| `golden-gather` | Golden Gather | `#FFFBF5` | `#D4920A` | Amber gold — celebratory without loud orange |
| `dusk-wine` | Dusk Wine | `#F5F3F0` | `#9B4D55` | Muted rose/wine — evening, sophisticated |

Definitions live in `packages/ui/src/components/brand/colorSchemes.ts`. Production tokens are in `global.css` (`@theme` block).

### Sidebar chrome exploration (storyboard)

Under Coral Bloom, sidebar and page are both white (`ig-surface` = `ig-page`) — only a border separates them. Nine left-nav treatments are previewed on `/brand`, grouped by style (Coral Bloom content, varying sidebar only).

| Group | ID | Name | Sidebar bg | Active nav |
|-------|-----|------|------------|------------|
| Light & tinted | `current-flat` | Flat white (today) | `#FFFFFF` | `#FFF0ED` pill + coral text |
| Light & tinted | `coral-wash` | Coral wash | `#FFF0ED` | White pill + coral text |
| Light & tinted | `warm-stone` | Warm stone | `#F5F3F0` | White pill + coral text |
| Light & tinted | `soft-blush` | Soft blush border | `#FFF0ED` + `#F5C4B8` border | White inset + coral text |
| Warm solid | `coral-bold` | Coral bold | `#E5634D` | White pill + coral text |
| Warm solid | `ember-orange` | Ember orange | `#FF5E3A` | White pill + ember text |
| Warm solid | `terracotta-solid` | Terracotta solid | `#C84B31` | White pill + terracotta text |
| Warm solid | `deep-rust` | Deep rust | `#A84838` | White pill + rust text |
| Dark anchor | `charcoal-anchor` | Charcoal anchor | `#2E3138` | `#FFF0ED` pill + coral text |

**Production sidebar:** Coral bold (`coral-bold`) — `ig-chrome` `#E5634D`, white nav labels, white active pill. Applied in `EventShell` and `AppShell` (desktop). Mobile tab bar unchanged.

Definitions live in `packages/ui/src/components/brand/sidebarChromeStrategies.ts`. Tokens in `global.css` (`ig-chrome-*`).

### Background strategy options

Review all three on `/brand` before Phase 2 rollout:

| Strategy | Token | Hex | Notes |
|----------|-------|-----|-------|
| Warm cream + white cards | `cf-page-current` | `#FFF7EC` | **Recommended default** — keeps brand warmth; cards lift to white |
| Neutral page + white cards | `cf-page-neutral` | `#FAFAF8` | More contrast; slightly less “firelight” |
| Deep cream + white cards | `cf-page-deep` | `#F5EDE3` | Richest page tone; strongest card separation |

**Selection workflow:** Open `/brand` → pick color scheme + background + logo lockup → follow-up updates `ig-page`, accent tokens, and card components app-wide.

### Logo system

Production UI still uses wordmark-only until a lockup is chosen on `/brand`.

| Lockup | Variant | Best for |
|--------|---------|----------|
| A | Wordmark only | Default nav, auth (current production) |
| B | Flame mark + horizontal wordmark | Sidebar, album header |
| C | Stacked: mark above wordmark | Marketing hero, startup wizard |
| D | Circle badge + wordmark | App icon preview, compact contexts |

**Components:** `FlameMark`, `CampfireLogoLockup` in `packages/ui/src/components/brand/`.

- **Canonical mark:** `FlameMark` — solid fills only; SSR-safe, no gradients
- **Legacy (migrate in Phase 2):** 3×3 tile grids in auth promo (gradient) and marketing (flat orange)
- **Default theme:** Dark text on cream
- **Dark theme:** White text on dark backgrounds (photo wall, fullscreen)
- **Clear space:** Height of the flame mark on all sides
- **Minimum size:** 80px wide wordmark on web; flame mark ≥ 20px
- **Favicon / PWA:** Use lockup D circle badge or flame mark alone once selected

**Production wordmark:** `CampfireLogo` with `CampfireMark` — flame rising from shared photo tiles and memory sparks (`packages/ui/src/components/brand/CampfireMark.tsx`). Default layout: horizontal in shell, stacked on auth/marketing hero.

### Card design language

Event and dashboard cards should use **elevated white surfaces**, not cream-on-cream:

- **Surface:** `bg-ig-surface`, `border-ig-border`, `ElevatedSurface` shadow
- **Theme stripe:** Optional 3px top bar using per-campfire `themeColor`
- **Content hierarchy:** Event type emoji + name → event date → upload count → created date
- **Current event:** Inline pill (`bg-cf-accent-light text-cf-accent`) — not a full-width footer bar
- **Preview component:** `CampfireEventCard` with styles `elevated` | `warm-header` | `legacy`

### Typography

- **Primary:** System sans stack — approachable, native, fast
- **Hierarchy:** Bold for headlines (`text-2xl`–`text-3xl`), semibold for labels, regular for body
- **Future upgrade (optional):** Rounded humanist sans (e.g. Nunito, DM Sans) for marketing only — keep system fonts in app for performance

### Imagery and UI mood

- Photos are the hero — UI stays warm and minimal
- Rounded corners (`rounded-xl`), soft borders, warm page with white elevated cards
- Photo wall: black letterbox + sharp contain — content first; UI chrome disappears

---

## Brand Voice

### Voice traits

1. **Warm** — "Share this link with everyone who came"
2. **Inclusive** — "Everyone who was there can add photos"
3. **Light** — Short sentences; avoid enterprise jargon
4. **Celebratory** — Acknowledge weddings, parties, milestones without being cheesy

### Tone by context

| Context | Tone | Example |
|---------|------|---------|
| Host onboarding | Encouraging, clear | "Name your gathering — we'll give you a link and QR to share." |
| Guest upload | Zero friction | "Add your photos from tonight." |
| Settings / moderation | Calm, capable | "Review uploads before they appear on the wall." |
| Photo wall (TV) | Minimal UI | Almost no copy — let photos speak |
| Errors | Supportive | "Something went wrong. Try again." |

### Messaging architecture

**Tagline:** Gather. Share. Relive.

**Alternates for marketing**

- "The album you build together."
- "Everyone adds to the story."

**Value proposition**

One shared album for your event — guests scan, upload, and watch memories grow on the photo wall.

**Key messages**

1. **Hosts:** Set up in minutes; share a QR; control what goes live
2. **Guests:** No account needed — scan and add your photos
3. **Venue / wall:** Turn the event into a living slideshow everyone contributed to

### Terminology

| Use | Avoid |
|-----|-------|
| Campfire (product) | Platform, solution |
| campfire (a shared album) | workspace, project |
| album / photo wall | repository, media library |
| guests, everyone who came | users, consumers |
| gather, share, relive | leverage, utilize, synergy |
| event (host admin UI) | Overusing "event" when "campfire" is warmer in marketing |

**Hierarchy:** **Campfire** = brand; **campfire** = one shared album; **event** = acceptable in host admin UI (My Events, Event Settings) for clarity.

### Copy examples (on-brand)

Use these as templates when writing or revising UI strings.

**Logged-out home**

> Shared albums for the people who were there. Sign in to start a campfire or open one from a guest link.

**Startup wizard (first campfire)**

> Create your first campfire
>
> Name your gathering — we'll give you a link and QR so everyone can add photos.

**Event home (host dashboard)**

> Here you'll find everything you need to share your album and photo wall with guests.

**Digital album card**

> Share this link or QR code so everyone who came can upload and view photos.

**My Events**

> Here you can find all your campfires or create a new one.

**Create event modal**

> Add new event
>
> What's the event title?

**Guest-facing upload**

> Add your photos

**Photo wall (minimal)**

> Enter Full Screen · Turn Sound On/Off · More Options (owners only)

---

## Brand Protection

- Trademark "Campfire" for software/photo sharing when ready
- Do not reference competitor product names in copy
- Host-uploaded content remains user-owned; brand stays in chrome, not on photos
- New features should pass the brand checklist below

---

## Brand Checklist (new features)

Before shipping a new screen or flow, confirm:

1. **Colors** — Warm page background + white elevated cards; `cf-accent` for primary actions; warm borders (no cool grays or Instagram blue)
2. **Voice** — Copy is warm, inclusive, and short; no enterprise jargon
3. **Terminology** — "Campfire" / "campfire" / "album" / "photo wall" used consistently per the table above
4. **Photos first** — UI chrome stays minimal; user content is the hero
5. **Togetherness** — Messaging emphasizes shared contribution, not solo ownership of the album

---

*Last updated: brand foundation v1. Aligns with `packages/ui/src/global.css` and product positioning as a group shared album.*
