import { pgTable, varchar, text } from 'drizzle-orm/pg-core'
import { users } from './users'

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  avatarUrl: text('avatar_url'),
  displayName: text('displayName').notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = Omit<typeof profiles.$inferInsert, 'id'>
