import { getConfig } from './config'
import { getDatabase } from './db'
import { initLogger } from './logger'

export const initInfrastructure = async () => {
  await initLogger()

  await getConfig()
  await getDatabase()
}
