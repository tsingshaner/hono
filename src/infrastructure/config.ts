import { Exception } from '@qingshaner/utility-hono'
import { loadConfig } from 'c12'
import * as v from 'valibot'

import { getAppLogger } from './logger'

const configSchema = v.object({
  auth: v.object({
    github: v.object({
      clientId: v.pipe(v.string(), v.nonEmpty()),
      clientSecret: v.pipe(v.string(), v.nonEmpty())
    }),

    secret: v.pipe(v.string(), v.nonEmpty(), v.minLength(32))
  }),

  baseURL: v.pipe(v.string(), v.url(), v.nonEmpty()),

  database: v.variant('driver', [
    v.object({
      driver: v.literal('pglite'),
      dataDir: v.optional(v.pipe(v.string(), v.nonEmpty()))
    }),
    v.object({
      driver: v.literal('postgres'),
      url: v.pipe(v.string(), v.url(), v.nonEmpty())
    })
  ])
})

let $config: v.InferOutput<typeof configSchema>

const readConfig = async () => {
  const { config } = await loadConfig({
    dotenv: {
      fileName: ['.env', '.env.local']
    },
    rcFile: false
  })

  const result = v.safeParse(configSchema, config)

  if (!result.success) {
    const logger = getAppLogger('config')
    const exception = new Exception({
      cause: new Error(`Invalid config: ${JSON.stringify(v.flatten(result.issues))}`),
      code: 'CONFIG_INVALID',
      position: 'infra.config'
    })

    const { cause, ...rest } = exception.toPlainObject()
    logger.fatal(cause as Error, rest)

    process.exit(1)
  }

  return result.output
}

export const getConfig = async () => {
  if (!$config) {
    $config = await readConfig()
  }

  return $config
}
