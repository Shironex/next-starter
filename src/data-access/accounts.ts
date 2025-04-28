import { eq } from 'drizzle-orm'

import { generateId } from '@/lib/auth'
import { db } from '@/lib/db'
import { Account, accounts } from '@/lib/db/schema'

export async function createAccount(userId: string, password: string) {
  const [account] = await db
    .insert(accounts)
    .values({
      id: generateId(21),
      userId,
      accountType: 'email',
      password,
      role: 'user',
    })
    .returning()
  return account
}

export async function createAccountViaGithub(userId: string, githubId: string) {
  await db
    .insert(accounts)
    .values({
      id: generateId(21),
      userId: userId,
      accountType: 'github' as const,
      githubId,
    })
    .onConflictDoNothing()
    .returning()
}

export async function createAccountViaGoogle(userId: string, googleId: string) {
  await db
    .insert(accounts)
    .values({
      id: generateId(21),
      userId: userId,
      accountType: 'google' as const,
      googleId,
    })
    .onConflictDoNothing()
    .returning()
}

export async function getAccountByUserId(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  })

  return account
}

export async function getAccountByGithubId(githubId: string) {
  return await db.query.accounts.findFirst({
    where: eq(accounts.githubId, githubId),
  })
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  })
}

export async function updateAccount(userId: string, data: Partial<Account>) {
  return await db.update(accounts).set(data).where(eq(accounts.userId, userId))
}

export async function updateAccountPassword(userId: string, password: string) {
  return await db
    .update(accounts)
    .set({ password })
    .where(eq(accounts.userId, userId))
}
