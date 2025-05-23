'use server'

import { redirect } from 'next/navigation'

import { setSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'
import { rateLimitByKey } from '@/lib/ratelimit'
import { unauthenticatedAction } from '@/lib/safe-action'

import { signUpUseCase } from '@/use-cases/auth'

import { signUpSchema } from './validation'

export const signUpAction = unauthenticatedAction
  .metadata({
    actionName: 'sign-up action',
    role: 'user',
  })
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    await rateLimitByKey(`${parsedInput.email}-signup`, 5, 120)

    const { id } = await signUpUseCase(
      parsedInput.email,
      parsedInput.password,
      `${parsedInput.firstName} ${parsedInput.lastName}`
    )

    await setSession(id, false)

    redirect(redirects.toVerify)
  })
