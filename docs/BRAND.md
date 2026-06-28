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
| Primary / Accent | `cf-accent` | `#FF5E3A` | CTAs, links, active nav, flame core |
| Accent light | `cf-accent-light` | `#FFF0E6` | Badges, selected pills, subtle highlights |
| Flame mid | `cf-flame-orange` | `#FF8A3D` | Gradients, illustrations, secondary emphasis |
| Flame highlight | `cf-flame-yellow` | `#FFC24D` | Warm accents, celebratory moments |
| Flame red (alias) | `cf-flame-red` | `#FF5E3A` | Same as accent; use for flame imagery |
| Page / warmth | `cf-cream` / `ig-page` | `#FFF7EC` | App background — firelight on faces |
| Card surface | `cf-card` | `#FFF7EC` | Dashboard cards on cream pages |
| Card border | `cf-card-border` | `#FFD4B8` | Warm card outlines |
| Surface | `ig-surface` | `#FFFFFF` | Cards, modals, sidebar |
| Text primary | `ig-text` / `cf-charcoal` | `#2E3138` | Headlines, body |
| Text muted | `ig-muted` / `cf-gray` | `#49505A` | Secondary copy |
| Border | `ig-border` | `#E8DFD4` | Dividers — warm gray, not cool gray |
| Error | `ig-red` | `#ED4956` | Errors only — do not use for brand accent |

**Accessibility:** Primary CTA `#FF5E3A` on white passes AA for large text. Use `cf-charcoal` text on cream for body. White text on `cf-accent` for buttons.

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
```

Default event theme color in the backend: `#FF5E3A` (`packages/backend/convex/lib/defaults.ts`).

### Logo

- **Primary:** Wordmark **Campfire** — bold, tight tracking (`packages/ui/src/components/CampfireLogo.tsx`)
- **Default theme:** Dark text on cream
- **Dark theme:** White text on dark backgrounds (photo wall, fullscreen)
- **Clear space:** Height of capital "C" on all sides
- **Minimum size:** 80px wide wordmark on web
- **Future (optional):** Flame icon mark for favicon/PWA — simple single-flame silhouette using accent gradient

### Typography

- **Primary:** System sans stack — approachable, native, fast
- **Hierarchy:** Bold for headlines (`text-2xl`–`text-3xl`), semibold for labels, regular for body
- **Future upgrade (optional):** Rounded humanist sans (e.g. Nunito, DM Sans) for marketing only — keep system fonts in app for performance

### Imagery and UI mood

- Photos are the hero — UI stays warm and minimal
- Rounded corners (`rounded-xl`), soft borders, cream not stark white pages
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

1. **Colors** — Uses cream page background, `cf-accent` for primary actions, warm borders (no cool grays or Instagram blue)
2. **Voice** — Copy is warm, inclusive, and short; no enterprise jargon
3. **Terminology** — "Campfire" / "campfire" / "album" / "photo wall" used consistently per the table above
4. **Photos first** — UI chrome stays minimal; user content is the hero
5. **Togetherness** — Messaging emphasizes shared contribution, not solo ownership of the album

---

*Last updated: brand foundation v1. Aligns with `packages/ui/src/global.css` and product positioning as a group shared album.*
