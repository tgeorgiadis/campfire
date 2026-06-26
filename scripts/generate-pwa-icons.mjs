import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'scripts/generate-pwa-icons.svg')
const outDir = join(root, 'apps/web/public')

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
]

const svg = await readFile(svgPath)
await mkdir(outDir, { recursive: true })

for (const { name, size } of sizes) {
  const png = await sharp(svg).resize(size, size).png().toBuffer()
  await writeFile(join(outDir, name), png)
}

const favicon32 = await readFile(join(outDir, 'favicon-32x32.png'))
await writeFile(join(outDir, 'favicon.ico'), favicon32)

console.log('Generated PWA icons in apps/web/public')
