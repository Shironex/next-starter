import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '../../env/server'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var -- only var works hereF
  var db: PostgresJsDatabase<typeof schema> | undefined
}

export const queryClient = postgres(env.DATABASE_URL)

let db: PostgresJsDatabase<typeof schema>

if (env.NODE_ENV === 'production') {
  db = drizzle(queryClient, { schema })
} else {
  if (!global.db) global.db = drizzle(queryClient, { schema })

  db = global.db
}

export { db }
