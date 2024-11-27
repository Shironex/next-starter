'use server'

import { redirects } from '@/lib/constants'
import { unauthenticatedAction } from '@/lib/safe-action'
import { sendPasswordResetLinkUseCase } from '@/use-cases/auth'
import { redirect } from 'next/navigation'
import { sendResetEmailSchema } from './validation'

export const sendPasswordResetLinkAction = unauthenticatedAction
  .createServerAction()
  .input(sendResetEmailSchema)
  .handler(async ({ input }) => {
    await sendPasswordResetLinkUseCase(input.email)

    redirect(redirects.toSignin)
  })
