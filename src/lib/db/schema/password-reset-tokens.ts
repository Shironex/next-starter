import { index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

import { users } from './users'

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: varchar('id', { length: 40 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (t) => ({
    userIdx: index('user_passreset_idx').on(t.userId),
  })
)

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect
export type NewPasswordResetToken = Omit<
  typeof passwordResetTokens.$inferInsert,
  'id'
>
