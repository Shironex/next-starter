'use server'

import { redirect } from 'next/navigation'

import { redirects } from '@/lib/constants'
import { unauthenticatedAction } from '@/lib/safe-action'

import { sendPasswordResetLinkUseCase } from '@/use-cases/auth'

import { sendResetEmailSchema } from './validation'

export const sendPasswordResetLinkAction = unauthenticatedAction
  .metadata({
    actionName: 'send-password-reset-link action',
    role: 'user',
  })
  .schema(sendResetEmailSchema)
  .action(async ({ parsedInput }) => {
    await sendPasswordResetLinkUseCase(parsedInput.email)

    redirect(redirects.toSignin)
  })
