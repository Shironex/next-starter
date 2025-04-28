import { cookies } from 'next/headers'

import { AuthService, SessionValidationResult } from '@/lib/auth'

export const validateRequest = async (): Promise<SessionValidationResult> => {
  const sessionCookieName = AuthService.getSessionCookieName()
  const cookiesInstance = await cookies()
  const sessionId = cookiesInstance.get(sessionCookieName)?.value ?? null

  if (!sessionId) {
    return { user: null, session: null, account: null }
  }

  const result = await AuthService.validateSession(sessionId)

  //? next.js throws when you attempt to set cookie when rendering page

  try {
    if (result.session) {
      const sessionCookie = AuthService.createSessionCookie(result.session.id)
      cookiesInstance.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!result.session) {
      const sessionCookie = AuthService.createBlankSessionCookie()
      cookiesInstance.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {}
  return result
}
