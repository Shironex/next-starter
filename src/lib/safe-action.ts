/* eslint-disable n/no-process-env */
import { env } from '@/env/server'
import { assertAuthenticated } from '@/lib/auth/session'
import { createServerActionProcedure } from 'zsa'
import { PublicError } from './errors'
import { rateLimitByKey } from './ratelimit'

const LIMIT_DURATION = 60

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError
  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = env.NODE_ENV === 'development'

  if (isAllowedError || isDev) {
    console.error(err)
    return {
      code: err.code ?? 'ERROR',
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${
        err.message
      }`,
    }
  } else {
    console.error(err)
    return {
      code: 'ERROR',
      message: 'Something went wrong',
    }
  }
}

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const { user, account, session } = await assertAuthenticated()

    if (process.env.cypress_test) {
      return { user, account, session }
    }

    await rateLimitByKey(`${user.id}-global`, 20, LIMIT_DURATION)

    return { user, account, session }
  })

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    if (process.env.cypress_test === 'true') {
      return
    }

    await rateLimitByKey('unauthenticated', 10, LIMIT_DURATION)
  })
