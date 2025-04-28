'use server'

import { redirect } from 'next/navigation'

import { redirects } from '@/lib/constants'
import { unauthenticatedAction } from '@/lib/safe-action'

import { resetPasswordUseCase } from '@/use-cases/auth'

import { resetPasswordSchema } from './validation'

export const resetPasswordAction = unauthenticatedAction
  .metadata({
    actionName: 'reset-password action',
    role: 'user',
  })
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    await resetPasswordUseCase(parsedInput.token, parsedInput.password)

    redirect(redirects.toSignin)
  })
