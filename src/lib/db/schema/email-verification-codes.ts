import { index, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

import { users } from './users'

export const emailVerificationCodes = pgTable(
  'email_verification_codes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .references(() => users.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    code: varchar('code', { length: 8 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (t) => ({
    userIdx: index('user_emailver_idx').on(t.userId),
    emailIdx: index('email_emailver_idx').on(t.email),
  })
)

export type EmailVerificationCode = typeof emailVerificationCodes.$inferSelect
export type NewEmailVerificationCode = Omit<
  typeof emailVerificationCodes.$inferInsert,
  'id'
>
