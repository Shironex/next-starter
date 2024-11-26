'use server'

import {
    clearSessionCookie,
    invalidateSession,
    setSession,
} from '@/lib/auth/session'
import { redirects } from '@/lib/constants'
import { authenticatedAction } from '@/lib/safe-action'
import {
    verifyEmailUseCase,
} from '@/use-cases/auth'
import { redirect } from 'next/navigation'
import { verifyEmailSchema } from './validation'

export const verifyEmailAction = authenticatedAction
  .createServerAction()
  .input(verifyEmailSchema)
  .handler(async ({ ctx, input }) => {
    await verifyEmailUseCase(ctx.user.id, ctx.user.email, input.code)

    await invalidateSession(ctx.user.id)
    await setSession(ctx.user.id, false)

    redirect(redirects.afterLogin)
  })

export const logoutAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    await invalidateSession(ctx.user.id)
    clearSessionCookie()

    redirect(redirects.toSignin)
  })
