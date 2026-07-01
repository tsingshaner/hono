import { defineConfig } from 'tsdown'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  deps: {
    alwaysBundle: ['hono/client']
  },
  dts: {
    tsgo: {
      enabled: true
    }
  },
  entry: 'src/client.ts',
  format: ['esm'],
  tsconfig: 'tsconfig.build.json'
})
