'use server'

import { redirect } from 'next/navigation'

import { setSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'
import { rateLimitByKey } from '@/lib/ratelimit'
import { unauthenticatedAction } from '@/lib/safe-action'

import { signInUseCase } from '@/use-cases/auth'

import { signInSchema } from './validation'

export const signInAction = unauthenticatedAction
  .metadata({
    actionName: 'sign-in action',
    role: 'user',
  })
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    const result = await rateLimitByKey(`${parsedInput.email}-signin`, 5, 120)

    if (!result.success) {
      throw new Error('Rate limit exceeded')
    }

    const { id, verified } = await signInUseCase(
      parsedInput.email,
      parsedInput.password
    )

    await setSession(id, false)

    if (!verified) {
      redirect(redirects.toVerify)
    }

    redirect(redirects.afterLogin)
  })
