import { eq } from 'drizzle-orm'
import { TimeSpan, createDate } from 'oslo'

import { generateId } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  User,
  emailVerificationCodes,
  passwordResetTokens,
  profiles,
  users,
} from '@/lib/db/schema'

export async function findUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId))

  if (!user) {
    return {
      user: null,
      profile: null,
    }
  }

  return {
    user: user.users,
    profile: user.profiles,
  }
}

export async function findUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(profiles.displayName, username))

  if (!user) {
    return {
      user: null,
      profile: null,
    }
  }

  return {
    user: user.users,
    profile: user.profiles,
  }
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return user
}

export async function findEmailVerificationCode(userId: string) {
  return await db.transaction(async (tx) => {
    const item = await tx.query.emailVerificationCodes.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    })
    if (item) {
      await tx
        .delete(emailVerificationCodes)
        .where(eq(emailVerificationCodes.id, item.id))
    }
    return item
  })
}

export async function findPasswordResetCode(userId: string) {
  return await db.query.passwordResetTokens.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  })
}

export async function createUser(
  email: string,
  emailVerified: boolean = false
) {
  const [newUser] = await db
    .insert(users)
    .values({
      id: generateId(21),
      email,
      emailVerified,
    })
    .returning()

  return newUser
}

export async function updateUser(userId: string, data: Partial<User>) {
  return await db.update(users).set(data).where(eq(users.id, userId))
}

export async function deletePasswordResetCode(token: string) {
  return await db.transaction(async (tx) => {
    const item = await tx.query.passwordResetTokens.findFirst({
      where: (table, { eq }) => eq(table.id, token),
    })
    if (item) {
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, item.id))
    }
    return item
  })
}

export async function generatePasswordResetToken(
  tokenId: string,
  userId: string
): Promise<string> {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId))

  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, 'h')),
  })

  return tokenId
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  return await db
    .update(profiles)
    .set({ avatarUrl })
    .where(eq(profiles.userId, userId))
}
