import { hc } from 'hono/client'

import type { AppType } from '.'

export const createClient = (url: string): ReturnType<typeof hc<AppType>> => hc<AppType>(url)
