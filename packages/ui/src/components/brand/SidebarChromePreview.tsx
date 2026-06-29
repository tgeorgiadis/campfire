import { Pressable, Text, View } from 'react-native'
import { CF_SHADOW_SM } from './brandShadow'
import { getColorScheme } from './colorSchemes'
import {
  SIDEBAR_CHROME_GROUPS,
  SIDEBAR_CHROME_GROUP_LABELS,
  SIDEBAR_CHROME_STRATEGIES,
  type SidebarChromeGroup,
  type SidebarChromeId,
  type SidebarChromeStrategy,
} from './sidebarChromeStrategies'

const PAGE_SCHEME = getColorScheme('coral-bloom')

const NAV_ITEMS = [
  { icon: '⌂', label: 'Home', active: true },
  { icon: '▦', label: 'Photos', active: false },
  { icon: '⚙', label: 'Settings', active: false },
] as const

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.08)',
        }}
      />
      <Text style={{ fontSize: 8, color: '#49505A' }}>{label}</Text>
    </View>
  )
}

function MiniShell({ strategy }: { strategy: SidebarChromeStrategy }) {
  const page = PAGE_SCHEME

  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: page.border,
        overflow: 'hidden',
        backgroundColor: page.page,
        flexDirection: 'row',
        minHeight: 220,
      }}
    >
      <View
        style={{
          width: 100,
          borderRightWidth: 1,
          borderRightColor: strategy.sidebarBorder,
          backgroundColor: strategy.sidebar,
          padding: 8,
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: '700', color: strategy.logoColor }}>
          Campfire
        </Text>

        <View style={{ gap: 3 }}>
          <Text
            style={{
              fontSize: 7,
              fontWeight: '600',
              color: strategy.navMuted,
              textTransform: 'uppercase',
            }}
          >
            Current Event
          </Text>
          <View
            style={{
              borderRadius: 6,
              borderWidth: 1,
              borderColor: strategy.eventBlockBorder,
              backgroundColor: strategy.eventBlockBg,
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 8, color: strategy.navText }} numberOfLines={1}>
              Summer BBQ
            </Text>
          </View>
        </View>

        <View style={{ gap: 2, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <View
              key={item.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 4,
                backgroundColor: item.active ? strategy.navActiveBg : 'transparent',
              }}
            >
              <Text style={{ fontSize: 9, color: item.active ? strategy.navActiveText : strategy.navText }}>
                {item.icon}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: item.active ? '600' : '400',
                  color: item.active ? strategy.navActiveText : strategy.navText,
                }}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: strategy.sidebarBorder,
            paddingTop: 6,
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 7, fontWeight: '600', color: strategy.navMuted }}>Account</Text>
          <Text style={{ fontSize: 7, color: strategy.accentColor }}>Sign out</Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 10, gap: 8 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: page.text }}>My Events</Text>
          <Text style={{ fontSize: 9, color: page.muted }}>Main content area</Text>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: page.border,
            backgroundColor: page.surface,
            overflow: 'hidden',
            boxShadow: CF_SHADOW_SM,
          }}
        >
          <View
            style={{
              backgroundColor: page.accentLight,
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11 }}>🎉</Text>
            <Text style={{ fontSize: 10, fontWeight: '600', color: page.text }} numberOfLines={1}>
              Summer BBQ 2026
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 6, gap: 2 }}>
            <Text style={{ fontSize: 9, color: page.muted }}>4 uploads</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export function SidebarChromePreview({
  strategy,
  highlighted,
  onPress,
}: {
  strategy: SidebarChromeStrategy
  highlighted?: boolean
  onPress?: () => void
}) {
  const panel = (
    <View
      style={{
        flex: 1,
        minWidth: 280,
        gap: 12,
        borderRadius: 12,
        borderWidth: highlighted ? 2 : 1,
        borderColor: highlighted ? PAGE_SCHEME.accent : PAGE_SCHEME.border,
        padding: 12,
        backgroundColor: PAGE_SCHEME.surface,
      }}
    >
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: PAGE_SCHEME.text }}>
            {strategy.name}
          </Text>
          {strategy.isProduction ? (
            <View
              style={{
                borderRadius: 999,
                backgroundColor: PAGE_SCHEME.accentLight,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: '600', color: PAGE_SCHEME.accent }}>
                Production
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={{ fontSize: 11, color: PAGE_SCHEME.muted }}>{strategy.personality}</Text>
      </View>

      <MiniShell strategy={strategy} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Swatch color={strategy.sidebar} label="Sidebar" />
        <Swatch color={strategy.navActiveBg} label="Active nav" />
        <Swatch color={strategy.sidebarBorder} label="Border" />
      </View>

      <Text style={{ fontSize: 10, color: PAGE_SCHEME.muted }}>{strategy.contrastNote}</Text>
    </View>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ flex: 1, minWidth: 280 }}>
        {panel}
      </Pressable>
    )
  }

  return panel
}

export function SidebarChromeComparison({
  highlightedId,
  onHighlight,
}: {
  highlightedId?: SidebarChromeId | null
  onHighlight?: (id: SidebarChromeId) => void
}) {
  return (
    <View style={{ gap: 28 }}>
      {SIDEBAR_CHROME_GROUPS.map((group) => {
        const strategies = SIDEBAR_CHROME_STRATEGIES.filter((entry) => entry.group === group)
        if (strategies.length === 0) {
          return null
        }

        return (
          <View key={group} style={{ gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: PAGE_SCHEME.text }}>
              {SIDEBAR_CHROME_GROUP_LABELS[group]}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
              {strategies.map((strategy) => (
                <SidebarChromePreview
                  key={strategy.id}
                  strategy={strategy}
                  highlighted={highlightedId === strategy.id}
                  onPress={onHighlight ? () => onHighlight(strategy.id) : undefined}
                />
              ))}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export {
  SIDEBAR_CHROME_GROUPS,
  SIDEBAR_CHROME_GROUP_LABELS,
  SIDEBAR_CHROME_STRATEGIES,
  type SidebarChromeGroup,
  type SidebarChromeId,
  type SidebarChromeStrategy,
}
