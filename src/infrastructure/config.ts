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
      dataDir: v.optional(v.pipe(v.string(), v.nonEmpty())),
      driver: v.literal('pglite')
    }),
    v.object({
      driver: v.literal('postgres'),
      url: v.pipe(v.string(), v.url(), v.nonEmpty())
    })
  ]),

  store: v.variant('driver', [
    v.object({
      base: v.pipe(v.pipe(v.string(), v.nonEmpty())),
      driver: v.literal('fs-lite')
    }),
    v.object({
      base: v.pipe(v.pipe(v.string(), v.nonEmpty())),
      driver: v.literal('upstash'),
      scanCount: v.optional(v.number()),
      ttl: v.optional(v.number())
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

  const logger = getAppLogger()
  if (!result.success) {
    const exception = new Exception({
      cause: new Error(`Invalid config: ${JSON.stringify(v.flatten(result.issues))}`),
      code: 'CONFIG_INVALID',
      position: 'infra.config'
    })

    const { cause, ...rest } = exception.toPlainObject()
    logger.fatal(cause as Error, rest)

    process.exit(1)
  }
  logger.info('Config loaded successfully', { config: result.output })

  return result.output
}

export const getConfig = async () => {
  if (!$config) {
    $config = await readConfig()
  }

  return $config
}
