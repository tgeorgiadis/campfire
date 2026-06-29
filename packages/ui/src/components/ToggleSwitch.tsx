import { useEffect, useRef } from 'react'
import { Animated, Easing, Pressable } from 'react-native'
import { focusRing, pressableBase } from './motion/motionClasses'

const TRACK_OFF = '#E8E4E0'
const TRACK_ON = '#E5634D'
const THUMB_TRAVEL = 20

export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [value, progress])

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, THUMB_TRAVEL],
  })

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TRACK_OFF, TRACK_ON],
  })

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      className={`${pressableBase} ${focusRing}`}
    >
      <Animated.View
        style={{ backgroundColor: trackColor }}
        className="w-11 h-6 rounded-full px-0.5 justify-center hover:opacity-95"
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
            boxShadow: '0 1px 2px rgba(46, 49, 56, 0.12)',
          }}
          className="w-5 h-5 rounded-full bg-white"
        />
      </Animated.View>
    </Pressable>
  )
}
