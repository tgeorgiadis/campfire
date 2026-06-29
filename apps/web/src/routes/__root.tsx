import appCss from '@campfire/ui/global.css?url'
import { NotFoundScreen } from '@campfire/ui'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Campfire',
      },
      {
        name: 'description',
        content:
          'One shared album for your gathering — guests scan, upload, and watch memories grow on the photo wall.',
      },
      {
        name: 'theme-color',
        content: '#FF5E3A',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#FF5E3A' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: RootNotFound,
  component: RootComponent,
})

function RootNotFound() {
  const navigate = useNavigate()
  return <NotFoundScreen onHome={() => void navigate({ to: '/' })} />
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans bg-ig-page" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
