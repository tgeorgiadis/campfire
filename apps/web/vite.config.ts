import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { uniwind } from 'uniwind/vite'
import { defineConfig } from 'vite'
import { rnw } from 'vite-plugin-rnw'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      'react-native-web',
      '@react-native/normalize-colors',
      'inline-style-prefixer',
    ],
  },
  resolve: {
    alias: {
      'inline-style-prefixer/lib': 'inline-style-prefixer/es',
      'css-in-js-utils/lib': 'css-in-js-utils/es',
    },
  },
  ssr: {
    noExternal: ['react-native-web', 'inline-style-prefixer', 'css-in-js-utils'],
  },
  legacy: {
    inconsistentCjsInterop: true,
  },
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    rnw(),
    tailwindcss(),
    uniwind({
      cssEntryFile: '../../packages/ui/src/global.css',
      dtsFile: './src/uniwind-types.d.ts',
    }),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
})
