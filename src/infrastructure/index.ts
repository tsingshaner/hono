import { getConfig } from './config'
import { getDatabase } from './db'
import { getStore } from './store'

export const initInfrastructure = async () => {
  const config = await getConfig()
  const db = await getDatabase()
  const store = await getStore()

  return {
    config,
    db,
    store
  }
}
