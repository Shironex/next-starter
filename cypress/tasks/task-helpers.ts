/* eslint-disable drizzle/enforce-delete-with-where */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../src/lib/db/schema'
import {
  notVerifiedUser,
  secondVerifiedUser,
  verifiedUser,
} from '../fixtures/auth.json'

const connection = postgres(
  'postgresql://postgres:example@localhost:5432/postgres'
)

export const db = drizzle(connection, {
  logger: false,
  schema,
})

async function tearDownDataBase() {
  console.info('[info] Task Started: TearDown DataBase')

  // Tablica wszystkich tabel do wyczyszczenia
  const tablesToDelete = [
    schema.users,
    schema.accounts,
    schema.totpCredentials,
    schema.passkeyCredentials,
    schema.passwordResetTokens,
    schema.profiles,
    schema.sessions,
    schema.emailVerificationCodes,
  ]

  try {
    await db.transaction(async (tx) => {
      await Promise.all(tablesToDelete.map((table) => tx.delete(table)))
    })

    console.log('[info] Task finished: TearDown DataBase')
    return null
  } catch (error) {
    console.error('[error] Task have failed due to reason:', error)
    throw error
  }
}

async function seedDataBase() {
  console.info('[info] Task Started: Database Seed')

  try {
    await db.transaction(async (tx) => {
      await tx.insert(schema.users).values({
        id: verifiedUser.userId,
        email: verifiedUser.email,
        emailVerified: verifiedUser.verified,
      })

      await tx.insert(schema.accounts).values({
        id: verifiedUser.accountId,
        userId: verifiedUser.userId,
        accountType: 'email',
        githubId: null,
        googleId: null,
        password: verifiedUser.hashedPassword,
        role: 'user',
        recoveryCode: null,
        registeredTOTP: false,
        registeredPassKey: false,
        registeredSecurityKey: false,
      })

      await tx.insert(schema.profiles).values({
        id: verifiedUser.profileId,
        userId: verifiedUser.userId,
        avatarUrl: null,
        displayName: verifiedUser.username,
      })
    })

    await db.transaction(async (tx) => {
      await tx.insert(schema.users).values({
        id: secondVerifiedUser.userId,
        email: secondVerifiedUser.email,
        emailVerified: secondVerifiedUser.verified,
      })

      await tx.insert(schema.accounts).values({
        id: secondVerifiedUser.accountId,
        userId: secondVerifiedUser.userId,
        accountType: 'email',
        githubId: null,
        googleId: null,
        password: secondVerifiedUser.hashedPassword,
        role: 'user',
        recoveryCode: null,
        registeredTOTP: false,
        registeredPassKey: false,
        registeredSecurityKey: false,
      })

      await tx.insert(schema.profiles).values({
        id: secondVerifiedUser.profileId,
        userId: secondVerifiedUser.userId,
        avatarUrl: null,
        displayName: secondVerifiedUser.username,
      })
    })

    await db.transaction(async (tx) => {
      await tx.insert(schema.users).values({
        id: notVerifiedUser.userId,
        email: notVerifiedUser.email,
        emailVerified: notVerifiedUser.verified,
      })

      await tx.insert(schema.accounts).values({
        id: notVerifiedUser.accountId,
        userId: notVerifiedUser.userId,
        accountType: 'email',
        githubId: null,
        googleId: null,
        password: notVerifiedUser.hashedPassword,
        role: 'user',
        recoveryCode: null,
        registeredTOTP: false,
        registeredPassKey: false,
        registeredSecurityKey: false,
      })

      await tx.insert(schema.profiles).values({
        id: notVerifiedUser.profileId,
        userId: notVerifiedUser.userId,
        avatarUrl: null,
        displayName: notVerifiedUser.username,
      })
    })

    console.info('[info] Task finished: Database Seed')

    //? Task is done
    return null
  } catch (error) {
    console.error('[error] Task have failed due to reason: ', error)
    throw error
  }
}

async function getVerificationCode(email: string) {
  try {
    const Code = await db.query.emailVerificationCodes.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    })
    if (Code == undefined) return undefined

    return Code.code
  } catch (error) {
    console.log('Error getting verification code:', error)
    throw error
  }
}

async function createVerificationCode(userId: string, email: string) {
  try {
    const expiresAt = new Date(Date.now() + 3600000)

    await db.insert(schema.emailVerificationCodes).values({
      email,
      code: '12345678',
      userId,
      expiresAt,
    })

    return '12345678'
  } catch (error) {
    console.log('Error creating verification code:', error)
    throw error
  }
}

async function getPasswordResetToken(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    })

    if (!user) {
      throw new Error('User not found')
    }

    const Code = await db.query.passwordResetTokens.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
    })

    if (Code == undefined) return undefined

    return Code.id
  } catch (error) {
    console.log('Error getting password reset token:', error)
    throw error
  }
}

async function pruneCodes() {
  try {
    return await db.transaction(async (tx) => {
      await tx.delete(schema.emailVerificationCodes)
      await tx.delete(schema.passwordResetTokens)
    })
  } catch (error) {
    console.error('Error pruning email verification codes:', error)
    throw error
  }
}

export {
  createVerificationCode, getPasswordResetToken, getVerificationCode, pruneCodes, seedDataBase, tearDownDataBase
}

