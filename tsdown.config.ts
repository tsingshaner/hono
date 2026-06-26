import { defineConfig } from 'tsdown'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  dts: {
    // cjsReexport: true,
    oxc: false
  },
  entry: 'src/client.ts',
  format: ['esm'],
  tsconfig: '.config/tsconfig.app.json'
})
