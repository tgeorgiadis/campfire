import { createElement } from 'react'
import { View } from 'react-native'

export type CampfireMarkSize = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<CampfireMarkSize, number> = {
  sm: 22,
  md: 28,
  lg: 44,
}

/**
 * Campfire brand mark — flame rising from shared memories.
 * Plain SVG via createElement (SSR-safe; no react-native-svg).
 */
export function CampfireMark({
  size = 'md',
}: {
  size?: CampfireMarkSize
  theme?: 'light' | 'dark'
}) {
  const px = SIZE_PX[size]

  return (
    <View
      style={{ width: px, height: px }}
      accessibilityLabel="Campfire"
      accessibilityRole="image"
    >
      {createElement(
        'svg',
        {
          width: px,
          height: px,
          viewBox: '0 0 32 32',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        createElement('circle', { cx: 22.5, cy: 6.5, r: 1.3, fill: '#FFC24D' }),
        createElement('circle', {
          cx: 25.5,
          cy: 10.5,
          r: 0.9,
          fill: '#FFC24D',
          opacity: 0.75,
        }),
        createElement('circle', {
          cx: 19,
          cy: 4.5,
          r: 0.75,
          fill: '#FFC24D',
          opacity: 0.55,
        }),
        createElement('rect', {
          x: 6.5,
          y: 20.5,
          width: 4.5,
          height: 4.5,
          rx: 1,
          fill: '#F5C4B8',
        }),
        createElement('rect', {
          x: 13.75,
          y: 22.5,
          width: 4.5,
          height: 4.5,
          rx: 1,
          fill: '#F5C4B8',
          opacity: 0.85,
        }),
        createElement('rect', {
          x: 21,
          y: 20.5,
          width: 4.5,
          height: 4.5,
          rx: 1,
          fill: '#F5C4B8',
        }),
        createElement('path', {
          d: 'M5.5 23.5C5.5 23.5 11 27 16 27C21 27 26.5 23.5 26.5 23.5',
          stroke: '#EE8573',
          strokeWidth: 1.25,
          strokeLinecap: 'round',
          fill: 'none',
          opacity: 0.55,
        }),
        createElement('path', {
          d: 'M16 28C8.5 24 7.5 17 10.5 12.5C11.75 9.75 14 7 16 4.5C18 7 20.25 9.75 21.5 12.5C24.5 17 23.5 24 16 28Z',
          fill: '#E5634D',
        }),
        createElement('path', {
          d: 'M16 25.5C11.5 22.5 11 17.5 13 14C14.25 11.75 15.25 9.5 16 7.5C16.75 9.5 17.75 11.75 19 14C21 17.5 20.5 22.5 16 25.5Z',
          fill: '#EE8573',
        }),
        createElement('path', {
          d: 'M16 21.5C14.25 19.75 13.75 16.5 14.75 13.5C15.25 12 15.75 10.5 16 9C16.25 10.5 16.75 12 17.25 13.5C18.25 16.5 17.75 19.75 16 21.5Z',
          fill: '#FFC24D',
        }),
      )}
    </View>
  )
}
