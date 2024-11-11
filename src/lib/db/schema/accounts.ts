import { pgTable, varchar, text, index, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'
import { accountTypeEnum, roleEnum } from './enums'

export const accounts = pgTable(
  'accounts',
  {
    id: varchar('id', { length: 21 }).primaryKey(),
    userId: varchar('user_id', { length: 21 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    accountType: accountTypeEnum('account_type').default('email').notNull(),
    githubId: text('github_id').unique(),
    googleId: text('google_id').unique(),
    password: text('password'),
    role: roleEnum('user').default('user').notNull(),
    recoveryCode: varchar('recovery_code', { length: 255 }),
    registeredTOTP: boolean('registered_totp').default(false).notNull(),
    registeredPassKey: boolean('registered_passkey').default(false).notNull(),
    registeredSecurityKey: boolean('registered_security_key')
      .default(false)
      .notNull(),
  },
  (table) => ({
    userIdAccountTypeIdx: index('user_id_account_type_idx').on(
      table.userId,
      table.accountType
    ),
  })
)

export type Account = typeof accounts.$inferSelect
export type NewAccount = Omit<typeof accounts.$inferInsert, 'id'>
