import { boolean, index, varchar, pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    email: text('email').unique().notNull(),
    emailVerified: boolean('email_verified').default(false).notNull(),
  },
  (t) => ({
    emailIdx: index('email_idx').on(t.email),
  })
)

export type User = typeof users.$inferSelect & {
  registered2FA: boolean
}
export type SafeUser = Omit<
  User,
  | 'hashedPassword'
  | 'createdAt'
  | 'updatedAt'
  | 'emailVerified'
  | 'recoveryCode'
> & {
  registered2FA: boolean
}
export type NewUser = typeof users.$inferInsert
