'use server'

import { redirect } from 'next/navigation'

import {
  clearSessionCookie,
  invalidateSession,
  setSession,
} from '@/lib/auth/session'
import { redirects } from '@/lib/constants'
import { authenticatedAction } from '@/lib/safe-action'

import { verifyEmailUseCase } from '@/use-cases/auth'

import { verifyEmailSchema } from './validation'

export const verifyEmailAction = authenticatedAction
  .metadata({
    actionName: 'verify-email action',
    role: 'user',
  })
  .schema(verifyEmailSchema)
  .action(async ({ parsedInput, ctx }) => {
    await verifyEmailUseCase(ctx.user.id, ctx.user.email, parsedInput.code)

    await invalidateSession(ctx.user.id)
    await setSession(ctx.user.id, false)

    redirect(redirects.afterLogin)
  })

export const logoutAction = authenticatedAction
  .metadata({
    actionName: 'logout action',
    role: 'user',
  })
  .action(async ({ ctx }) => {
    await invalidateSession(ctx.user.id)
    clearSessionCookie()

    redirect(redirects.toSignin)
  })
