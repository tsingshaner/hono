import { defineConfig } from 'tsdown'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  deps: {
    alwaysBundle: ['hono/client'],
    onlyBundle: ['hono']
  },
  dts: {
    tsgo: true
  },
  entry: 'src/client.ts',
  format: ['esm'],
  tsconfig: 'tsconfig.json'
})
