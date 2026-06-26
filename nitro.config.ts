import { defineConfig } from 'nitro'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  entry: 'src/index.ts',
  preset: 'vercel'
})
