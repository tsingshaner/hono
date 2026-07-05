import { getLogger } from '@logtape/logtape'
import { Exception } from '@qingshaner/utility-hono'
import { loadConfig } from 'c12'
import * as v from 'valibot'

const configSchema = v.object({
  baseURL: v.pipe(v.string(), v.url(), v.nonEmpty()),

  auth: v.object({
    secret: v.pipe(v.string(), v.nonEmpty(), v.minLength(32)),

    github: v.object({
      clientId: v.pipe(v.string(), v.nonEmpty()),
      clientSecret: v.pipe(v.string(), v.nonEmpty())
    })
  }),

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
    rcFile: false,
    dotenv: {
      env: process.env,
      fileName: ['.env', '.env.local']
    }
  })

  const result = v.safeParse(configSchema, {
    auth: {
      secret: config.authSecret,
      github: {
        clientId: config.githubClientId,
        clientSecret: config.githubClientSecret
      }
    },
    baseURL: config.baseURL,
    database: {
      driver: config.databaseDriver,
      dataDir: config.databaseDataDir,
      url: config.databaseUrl
    }
  } satisfies v.InferOutput<typeof configSchema>)

  if (!result.success) {
    const logger = getLogger('config')
    const exception = new Exception({
      cause: new Error('Invalid config'),
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
