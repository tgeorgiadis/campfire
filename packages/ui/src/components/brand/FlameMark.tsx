import { CampfireMark, type CampfireMarkSize } from './CampfireMark'

export type FlameMarkSize = CampfireMarkSize

/** @deprecated Use CampfireMark — kept for storyboard compatibility */
export function FlameMark({
  size = 'md',
  theme,
}: {
  size?: FlameMarkSize
  theme?: 'light' | 'dark'
}) {
  return <CampfireMark size={size} theme={theme} />
}
