import { cookies } from 'next/headers'
import { cache } from 'react'

import 'server-only'

import { AuthService } from '@/lib/auth'
import { generateId } from '@/lib/auth/crypto'
import { AuthenticationError } from '@/lib/errors'

import { AccountRole } from '@/types'

import { validateRequest } from './validate-request'

export const getCurrentSession = cache(async () => {
  const session = await validateRequest()

  if (!session.session || !session.user || !session.account) {
    return {
      user: undefined,
      session: undefined,
      account: undefined,
    }
  }

  return {
    user: session.user,
    session: {
      ...session.session,
      role: session.account.role as AccountRole,
    },
    account: session.account,
  }
})

export const assertAuthenticated = async () => {
  const { user, account, session } = await getCurrentSession()

  if (!user || !account || !session) {
    throw new AuthenticationError()
  }

  return { user, account, session }
}

export async function invalidateSession(userId: string) {
  await AuthService.invalidateUserSessions(userId)
}

export function clearSessionCookie() {
  const sessionCookie = AuthService.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}

export async function setSession(
  userId: string,
  is2FAVerified: boolean,
  oldSessionId?: string
) {
  const token = generateId(20)

  const session = await AuthService.createSession(token, userId, oldSessionId)
  const sessionCookie = AuthService.createSessionCookie(session.id)

  if (is2FAVerified) {
    await AuthService.setSessionAs2FAVerified(session.id)
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}

export async function updateSession(
  userId: string,
  is2FAVerified: boolean = false,
  oldSessionId?: string
) {
  await setSession(userId, is2FAVerified, oldSessionId)
}
