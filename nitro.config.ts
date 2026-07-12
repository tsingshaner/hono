import { resolve } from 'node:path'

import { defineConfig } from 'nitro'

export default defineConfig({
  alias: {
    '@': 'src'
  },
  entry: 'src/index.ts',
  experimental: {
    tasks: true
  },
  preset: 'node',
  sourcemap: true,
  tasks: {
    echo: {
      description: 'Echoes the input arguments back to the user',
      handler: resolve('./src/tasks/echo.ts')
    }
  }
})
