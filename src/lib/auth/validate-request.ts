import { AuthService, SessionValidationResult } from '@/lib/auth'
import { cookies } from 'next/headers'

export const validateRequest = async (): Promise<SessionValidationResult> => {
  const sessionCookieName = AuthService.getSessionCookieName()
  const sessionId = cookies().get(sessionCookieName)?.value ?? null

  if (!sessionId) {
    return { user: null, session: null, account: null }
  }

  const result = await AuthService.validateSession(sessionId)

  //? next.js throws when you attempt to set cookie when rendering page

  try {
    if (result.session) {
      const sessionCookie = AuthService.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!result.session) {
      const sessionCookie = AuthService.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {}
  return result
}
