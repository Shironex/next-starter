import type { RandomReader } from '@oslojs/crypto/random'
import { generateRandomString } from '@oslojs/crypto/random'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  Account,
  Session,
  User,
  accounts,
  sessions,
  users,
} from '@/lib/db/schema'

import { env } from '@/env/server'

export type SessionValidationResult =
  | { session: Session; user: User; account: Account }
  | { session: null; user: null; account: null }

interface Cookie {
  name: string
  value: string
  attributes: {
    domain: string
    path?: string
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax' | 'strict' | 'none'
    expires: Date
    maxAge?: number
  }
}

const random: RandomReader = {
  read(bytes: Uint8Array): void {
    crypto.getRandomValues(bytes)
  },
}

class AuthService {
  private sessionDuration = 1000 * 60 * 60 * 24 * 30 //? 30 days
  private sessionRefreshThreshold = 1000 * 60 * 60 * 24 * 15 //? 15 days
  private sessionCookieName = 'session'

  constructor() {}

  public getSessionCookieName(): string {
    return this.sessionCookieName
  }

  //? Generates a session token
  public generateSession(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }

  //? Creates a new session for a user
  public async createSession(
    token: string,
    userId: string,
    oldSessionId?: string
  ): Promise<Session> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token))
    )
    const session: Session = {
      id: sessionId,
      userId,
      twoFactorVerified: false,
      expiresAt: new Date(Date.now() + this.sessionDuration),
    }
    await db.insert(sessions).values(session)
    if (oldSessionId) {
      await db.delete(sessions).where(eq(sessions.id, oldSessionId))
    }
    return session
  }

  //? Creates a session cookie
  public createSessionCookie(sessionId: string): Cookie {
    const expires = new Date(Date.now() + this.sessionDuration)
    return {
      name: this.sessionCookieName,
      value: sessionId,
      attributes: {
        expires,
        httpOnly: true,
        domain: env.APP_DOMAIN,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }
  }

  //? Create blank session cookie
  public createBlankSessionCookie(): Cookie {
    return {
      name: this.sessionCookieName,
      value: '',
      attributes: {
        expires: new Date(0),
        maxAge: 0,
        httpOnly: true,
        domain: env.APP_DOMAIN,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }
  }

  //? Validates a session token
  public async validateSession(
    sessionId: string
  ): Promise<SessionValidationResult> {
    const result = await db
      .select({ user: users, session: sessions, account: accounts })
      .from(sessions)
      .innerJoin(accounts, eq(sessions.userId, accounts.userId))
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))

    if (result.length < 1) {
      return { session: null, user: null, account: null }
    }

    const { user, session, account } = result[0]

    //? If the session has expired, delete it
    if (Date.now() >= session.expiresAt.getTime()) {
      await db.delete(sessions).where(eq(sessions.id, session.id))
      return { session: null, user: null, account: null }
    }

    //? If the session is going to expire in the next 15 days, refresh it
    if (
      Date.now() >=
      session.expiresAt.getTime() - this.sessionRefreshThreshold
    ) {
      session.expiresAt = new Date(Date.now() + this.sessionDuration)
      await db
        .update(sessions)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessions.id, session.id))
    }
    const twoFactorVerified =
      account.registeredTOTP ||
      account.registeredPassKey ||
      account.registeredSecurityKey
    return {
      session,
      user: { ...user, registered2FA: twoFactorVerified },
      account,
    }
  }

  //? set Session 2 FA status to verified
  public async setSessionAs2FAVerified(sessionId: string): Promise<void> {
    await db
      .update(sessions)
      .set({ twoFactorVerified: true })
      .where(eq(sessions.id, sessionId))
  }

  //? set Session 2 FA status to unverified
  public async setSessionAs2FAUnverified(sessionId: string): Promise<void> {
    await db
      .update(sessions)
      .set({ twoFactorVerified: false })
      .where(eq(sessions.id, sessionId))
  }

  //? Invalidates a session by its ID
  public async invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  }

  //? Invalidates all sessions for a user
  public async invalidateUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId))
  }
}

function generateId(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return generateRandomString(random, alphabet, length)
}

const authServiceInstance = new AuthService()

export { authServiceInstance as AuthService, generateId }
