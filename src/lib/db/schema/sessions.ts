import {
  boolean,
  index,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { users } from './users'

export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    twoFactorVerified: boolean('two_factor_verified').default(false).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (t) => ({
    userIdx: index('user_idx').on(t.userId),
  })
)

export type Session = typeof sessions.$inferSelect
