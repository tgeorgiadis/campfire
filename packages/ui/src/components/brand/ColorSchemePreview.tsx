import { Pressable, Text, View } from 'react-native'
import { STORYBOARD_EVENT_CARDS } from './CampfireEventCard'
import { CF_SHADOW_SM } from './brandShadow'
import { COLOR_SCHEMES, type ColorScheme, type ColorSchemeId } from './colorSchemes'

function MiniEventCard({
  scheme,
  name,
  emoji,
  date,
  uploads,
  isCurrent,
}: {
  scheme: ColorScheme
  name: string
  emoji: string
  date: string
  uploads: string
  isCurrent?: boolean
}) {
  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: scheme.border,
        backgroundColor: scheme.surface,
        overflow: 'hidden',
        boxShadow: CF_SHADOW_SM,
      }}
    >
      <View
        style={{
          backgroundColor: scheme.accentLight,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 14 }}>{emoji}</Text>
        <Text
          style={{ fontSize: 12, fontWeight: '600', color: scheme.text, flex: 1 }}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 2 }}>
        <Text style={{ fontSize: 10, color: scheme.text, fontWeight: '500' }}>{date}</Text>
        <Text style={{ fontSize: 10, color: scheme.muted }}>{uploads}</Text>
        {isCurrent ? (
          <View
            style={{
              alignSelf: 'flex-start',
              marginTop: 4,
              borderRadius: 999,
              backgroundColor: scheme.accentLight,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: '600', color: scheme.accent }}>
              Current Event
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

function MiniToggle({ scheme }: { scheme: ColorScheme }) {
  return (
    <View
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: scheme.accent,
        justifyContent: 'center',
        paddingHorizontal: 2,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: scheme.surface,
          alignSelf: 'flex-end',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      />
    </View>
  )
}

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

export function ColorSchemePreview({
  scheme,
  highlighted,
  onPress,
}: {
  scheme: ColorScheme
  highlighted?: boolean
  onPress?: () => void
}) {
  const sidebar = scheme.sidebar ?? scheme.surface
  const cards = STORYBOARD_EVENT_CARDS.slice(0, 2)

  const panel = (
    <View
      style={{
        flex: 1,
        minWidth: 280,
        gap: 12,
        borderRadius: 12,
        borderWidth: highlighted ? 2 : 1,
        borderColor: highlighted ? scheme.accent : scheme.border,
        padding: 12,
        backgroundColor: scheme.surface,
      }}
    >
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: scheme.text }}>
            {scheme.name}
          </Text>
          {scheme.isProduction ? (
            <View
              style={{
                borderRadius: 999,
                backgroundColor: scheme.accentLight,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: '600', color: scheme.accent }}>
                Production
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={{ fontSize: 11, color: scheme.muted }}>{scheme.personality}</Text>
      </View>

      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: scheme.border,
          overflow: 'hidden',
          backgroundColor: scheme.page,
        }}
      >
        <View style={{ flexDirection: 'row', minHeight: 280 }}>
          <View
            style={{
              width: 56,
              borderRightWidth: 1,
              borderRightColor: scheme.border,
              backgroundColor: sidebar,
              padding: 8,
              gap: 6,
            }}
          >
            <View
              style={{ height: 8, width: 32, borderRadius: 4, backgroundColor: scheme.accent }}
            />
            <View
              style={{
                height: 6,
                width: '100%',
                borderRadius: 3,
                backgroundColor: scheme.accentLight,
              }}
            />
            <View
              style={{ height: 6, width: '100%', borderRadius: 3, backgroundColor: scheme.border }}
            />
            <View
              style={{ height: 6, width: '100%', borderRadius: 3, backgroundColor: scheme.border }}
            />
          </View>

          <View style={{ flex: 1, padding: 10, gap: 8 }}>
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: scheme.text }}>My Events</Text>
              <Text style={{ fontSize: 9, color: scheme.muted }}>Preview layout</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {cards.map((event, index) => (
                <View key={event.name} style={{ width: '48%' }}>
                  <MiniEventCard
                    scheme={scheme}
                    name={event.name}
                    emoji={index === 0 ? '💒' : '🎉'}
                    date={event.eventDate ?? event.createdDate}
                    uploads={`${event.uploadCount} upload${event.uploadCount === 1 ? '' : 's'}`}
                    isCurrent={event.isCurrent}
                  />
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <View
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: scheme.accent,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#FFFFFF' }}>
                  Create Event
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderWidth: 1,
                  borderColor: scheme.border,
                  backgroundColor: scheme.surface,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '600', color: scheme.text }}>
                  Secondary
                </Text>
              </View>
              <Text style={{ fontSize: 10, fontWeight: '600', color: scheme.accent }}>
                View all
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <View
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: scheme.accent,
                  backgroundColor: scheme.accentLight,
                }}
              >
                <Text style={{ fontSize: 9, color: scheme.text }}>🎉 Party</Text>
              </View>
              <View
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: scheme.border,
                  backgroundColor: scheme.surface,
                }}
              >
                <Text style={{ fontSize: 9, color: scheme.text }}>💒 Wedding</Text>
              </View>
              <MiniToggle scheme={scheme} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Swatch color={scheme.page} label="Page" />
        <Swatch color={scheme.accent} label="Accent" />
        <Swatch color={scheme.accentLight} label="Accent light" />
        <Swatch color={scheme.border} label="Border" />
      </View>

      <Text style={{ fontSize: 10, color: scheme.muted }}>{scheme.contrastNote}</Text>
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

export function ColorSchemeComparison({
  highlightedSchemeId,
  onHighlightScheme,
}: {
  highlightedSchemeId?: ColorSchemeId | null
  onHighlightScheme?: (id: ColorSchemeId) => void
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
      {COLOR_SCHEMES.map((scheme) => (
        <ColorSchemePreview
          key={scheme.id}
          scheme={scheme}
          highlighted={highlightedSchemeId === scheme.id}
          onPress={onHighlightScheme ? () => onHighlightScheme(scheme.id) : undefined}
        />
      ))}
    </View>
  )
}

export { COLOR_SCHEMES, type ColorScheme, type ColorSchemeId }
