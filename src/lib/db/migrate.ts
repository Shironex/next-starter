import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import { env } from '@/env/server'

import * as schema from './schema'

export async function runMigrate() {
  const connection = postgres(env.DATABASE_URL, { max: 1 })

  const db = drizzle(connection, { schema })

  console.log('⏳ Running migrations...')

  const start = Date.now()

  await migrate(db, { migrationsFolder: './drizzle' })

  const end = Date.now()

  console.log(`✅ Migrations completed in ${end - start}ms`)

  await connection.end()

  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed')
  console.error(err)
  process.exit(1)
})
