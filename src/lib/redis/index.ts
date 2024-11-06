import type { Redis } from 'ioredis'
import createRedisClient from 'ioredis'

import { env } from '@/env/server'

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var redisClient: Redis | undefined
}

let redisClient: Redis

if (env.NODE_ENV === 'production') {
  redisClient = new createRedisClient(env.REDIS_HOST, {
    maxRetriesPerRequest: null,
  })
} else {
  if (!global.redisClient)
    global.redisClient = new createRedisClient(env.REDIS_HOST, {
      maxRetriesPerRequest: null,
    })

  redisClient = global.redisClient
}

export { redisClient }
