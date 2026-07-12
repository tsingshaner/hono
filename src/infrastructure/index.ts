import { getConfig } from './config'
import { getDatabase } from './db'

export const initInfrastructure = async () => {
  const config = await getConfig()
  const db = await getDatabase()

  return {
    config,
    db
  }
}
