'use server'

import { redirect } from 'next/navigation'

import { setSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'
import { rateLimitByKey } from '@/lib/ratelimit'
import { unauthenticatedAction } from '@/lib/safe-action'

import { signInUseCase } from '@/use-cases/auth'

import { signInSchema } from './validation'

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    const result = await rateLimitByKey(`${input.email}-signin`, 5, 120)

    if (!result.success) {
      throw new Error('Rate limit exceeded')
    }

    const { id, verified } = await signInUseCase(input.email, input.password)

    await setSession(id, false)

    if (!verified) {
      redirect(redirects.toVerify)
    }

    redirect(redirects.afterLogin)
  })
