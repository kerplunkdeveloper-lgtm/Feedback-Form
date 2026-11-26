// Turns the white-on-blue Kerplunk logo into a white logo on a transparent background.
// Usage: node scripts/make-logo-transparent.mjs <input.png> [output.png]
// Default output: public/logo.png
import fs from 'node:fs'
import { PNG } from 'pngjs'

const [input, output = 'public/logo.png'] = process.argv.slice(2)
if (!input) {
  console.error('Usage: node scripts/make-logo-transparent.mjs <input.png> [output.png]')
  process.exit(1)
}

const png = PNG.sync.read(fs.readFileSync(input))
const { width, height, data } = png

// Background colour = top-left corner pixel.
const bg = [data[0], data[1], data[2]]
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b
const bgL = lum(...bg)

for (let i = 0; i < width * height * 4; i += 4) {
  // How far this pixel is from the background towards white (0..1) → alpha.
  const t = (lum(data[i], data[i + 1], data[i + 2]) - bgL) / (255 - bgL)
  const a = Math.max(0, Math.min(1, t))
  data[i] = data[i + 1] = data[i + 2] = 255
  data[i + 3] = Math.round(a * 255)
}

fs.writeFileSync(output, PNG.sync.write(png))
console.log(`Saved transparent logo → ${output} (${width}x${height})`)
