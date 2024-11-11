import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin'])
export const accountTypeEnum = pgEnum('account_type', [
  'email',
  'google',
  'github',
])

//? Enum types
export type RoleEnum = typeof roleEnum.enumValues
export type AccountTypeEnum = typeof accountTypeEnum.enumValues
