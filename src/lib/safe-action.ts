import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

import { env } from '@/env/server'

import { getCurrentSession } from './auth/session'
import { AuthenticationError, PublicError } from './errors'
import { logger } from './logger'

// Base client.
const unauthenticatedAction = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
      role: z.enum(['admin', 'user']).default('user'),
    })
  },
  async handleServerError(err, _utils) {
    const isAllowedError = err instanceof PublicError
    const isDev = env.NODE_ENV === 'development'
    logger.error('Error ->', err)
    if (isAllowedError || isDev) {
      logger.error(err)
      return `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${err.message}`
    } else {
      logger.error(err)
      return 'Something went wrong'
    }
  },
}).use(async ({ next, metadata }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  logger.info('LOGGING MIDDLEWARE')
  
  const startTime = performance.now()
  
  // Here we await the action execution.
  const result = await next()
  
  const endTime = performance.now()
  
  logger.info('Action metadata:', metadata)
  logger.info('Action execution took', endTime - startTime, 'ms')

  // And then return the result of the awaited action.
  return result
})

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
const authenticatedAction = unauthenticatedAction.use(
  async ({ next }) => {
    const { user, account, session } = await getCurrentSession()

    if (!user || !account || !session) {
      throw new AuthenticationError()
    }

    return next({
      ctx: {
        user,
        account,
        session,
      },
    })
  }
)

export { authenticatedAction, unauthenticatedAction }
