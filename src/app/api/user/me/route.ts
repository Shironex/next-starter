import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AuthService } from '@/lib/auth'

import { getUserProfileUseCase } from '@/use-cases/users'

export async function GET() {
  const cookieName = AuthService.getSessionCookieName()
  const cookiesInstance = await cookies()
  const sessionId = cookiesInstance.get(cookieName)?.value ?? null

  if (!sessionId) {
    return NextResponse.json(
      { user: null, session: null },
      {
        status: 401,
      }
    )
  }

  const result = await AuthService.validateSession(sessionId)
  try {
    if (!result.session) {
      return NextResponse.json(
        { user: null, session: null },
        {
          status: 403,
        }
      )
    }

    const profile = await getUserProfileUseCase(result.user.id)

    if (!profile) {
      return NextResponse.json(
        { user: null, session: null },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      user: {
        email: result.user.email,
        name: profile.displayName,
        avatar: profile.avatarUrl,
        role: result.account.role,
      },
      session: result.session,
    })
  } catch (e: unknown) {
    console.log('[error] Failed route /api/user/me: ', e)
    return NextResponse.json(
      { user: null, session: null },
      {
        status: 500,
      }
    )
  }
}
