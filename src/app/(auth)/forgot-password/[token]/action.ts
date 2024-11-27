'use server'

import { redirects } from '@/lib/constants'
import { unauthenticatedAction } from '@/lib/safe-action'
import { resetPasswordUseCase } from '@/use-cases/auth'
import { redirect } from 'next/navigation'
import { resetPasswordSchema } from './validation'

export const resetPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(resetPasswordSchema)
  .handler(async ({ input }) => {
    await resetPasswordUseCase(input.token, input.password)

    redirect(redirects.toSignin)
  })
