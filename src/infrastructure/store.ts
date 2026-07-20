import { createStorage, type Storage } from 'unstorage'

import { getConfig } from './config'

let $store: Storage
export const getStore = async () => {
  if (!$store) {
    const config = await getConfig()
    const driver =
      config.store.driver === 'fs-lite'
        ? await import('unstorage/drivers/fs-lite')
        : await import('unstorage/drivers/upstash')
    $store = createStorage({
      driver: driver.default(config.store)
    })
  }

  return $store
}
