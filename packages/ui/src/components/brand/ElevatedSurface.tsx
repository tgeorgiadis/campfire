import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import { cardInteractive } from '../motion/motionClasses'
import { CF_SHADOW_SM } from './brandShadow'

export function ElevatedSurface({
  children,
  className = '',
  shadow = CF_SHADOW_SM,
  interactive = false,
  ...props
}: ViewProps & {
  children: ReactNode
  className?: string
  shadow?: string
  interactive?: boolean
}) {
  return (
    <View
      className={`${interactive ? cardInteractive : ''} ${className}`}
      style={{ boxShadow: shadow }}
      {...props}
    >
      {children}
    </View>
  )
}
