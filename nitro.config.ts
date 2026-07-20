import { defineConfig } from 'nitro'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  debug: true,
  entry: 'src/index.ts',
  preset: 'node',
  sourcemap: true
})
