import { getLogger } from '@logtape/logtape'
import { Exception } from '@qingshaner/utility-hono'
import { loadConfig } from 'c12'
import * as v from 'valibot'

const configSchema = v.object({
  auth: v.object({
    github: v.object({
      clientId: v.pipe(v.string(), v.nonEmpty()),
      clientSecret: v.pipe(v.string(), v.nonEmpty())
    }),
    secret: v.pipe(v.string(), v.nonEmpty())
  }),
  baseURL: v.pipe(v.string(), v.url(), v.nonEmpty()),
  database: v.union([
    v.pipe(v.string(), v.url(), v.nonEmpty()),
    v.object({
      dataDir: v.optional(v.pipe(v.string(), v.nonEmpty())),
      driver: v.literal('pglite')
    }),
    v.object({
      driver: v.literal('postgres'),
      url: v.pipe(v.string(), v.url(), v.nonEmpty())
    })
  ])
})

let $config: v.InferOutput<typeof configSchema>

export const getConfig = async () => {
  if (!$config) {
    const { config } = await loadConfig({})

    const result = v.safeParse(configSchema, config)
    if (!result.success) {
      const logger = getLogger('config')
      const exception = new Exception({
        cause: new Error('Invalid config'),
        code: 'CONFIG_INVALID',
        position: 'app.config'
      })

      const { cause, ...rest } = exception.toPlainObject()
      logger.fatal(cause as Error, rest)

      process.exit(1)
    }

    $config = result.output
  }

  return $config
}
