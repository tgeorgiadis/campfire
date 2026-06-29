/** Sidebar chrome (Coral bold) — desktop nav shell tokens as Tailwind classes. */

export const sidebarChromeShell =
  'bg-ig-chrome border-r border-ig-chrome-border flex-col'

export const sidebarChromeDivider = 'border-white/20'

export const sidebarChromeMuted = 'text-ig-chrome-muted tracking-wide'

export const sidebarChromeText = 'text-ig-chrome-foreground'

export const sidebarChromeLink =
  'text-ig-chrome-foreground hover:opacity-80 active:opacity-70'

/** Logo row — centered in sidebar width */
export const sidebarChromeLogoWrap = 'w-full items-center mb-5'

/** Compact white badge — logo mark is coral; needs contrast on chrome bg */
export const sidebarChromeLogoBadge =
  'rounded-xl bg-ig-surface px-3 py-2 shadow-sm border border-black/5'

/** Solid white control — readable select on coral sidebar */
export const sidebarChromeEventSelect =
  'rounded-xl bg-ig-surface border border-black/5 shadow-sm px-3 py-2.5 min-h-[40px] justify-center'

export const sidebarChromeCreateButton =
  'mt-3 rounded-xl border border-white/40 py-2.5 px-3 hover:bg-white/10 active:bg-white/15'

export const sidebarChromeSectionDivider = 'border-t border-white/20 my-4'

export const chromeNavHover =
  'hover:bg-white/10 active:bg-white/15 transition-colors duration-150 rounded-xl'

/** Active nav: deeper coral inset — clear without a white slab */
export const chromeNavActive =
  'bg-ig-chrome-border rounded-xl border border-white/25 shadow-sm'

export const chromeNavActiveText = 'font-bold text-white'

export const chromeNavActiveIcon = 'text-white'

export const chromeNavInactiveText = 'text-white/80'

export const chromeNavInactiveIcon = 'text-white/65'

export const chromeFocusRing =
  'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2'
