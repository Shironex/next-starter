import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

import { users } from './users'

export const totpCredentials = pgTable('totp_credentials', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  key: text('key').notNull(),
})

export const passkeyCredentials = pgTable('passkey_credentials', {
  id: varchar('id', { length: 21 }).primaryKey(),
  userId: varchar('user_id', { length: 21 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  webauthnId: text('webauthn_id').notNull(),
  name: text('name').notNull(),
  algorithmId: integer('algorithm_id').notNull(),
  publicKey: text('public_key').notNull(),
})

export type TotpCredential = typeof totpCredentials.$inferSelect
export type NewTotpCredential = Omit<typeof totpCredentials.$inferInsert, 'id'>

export type PasskeyCredential = typeof passkeyCredentials.$inferSelect
export type NewPasskeyCredential = Omit<
  typeof passkeyCredentials.$inferInsert,
  'id'
>
