import Redis from 'ioredis'

import { env } from '@/env/server'

import { RateLimitError } from '../errors'
import { redisClient } from '../redis'

type Result = {
  limit: number
  remaining: number
  success: boolean
}

const rateLimiter = async (
  client: Redis,
  key: string,
  limit: number,
  duration: number
): Promise<Result> => {
  if (env.NODE_ENV === 'test') {
    return { limit, remaining: limit, success: true } as Result
  }

  const currentCount = await client.get(key)
  const count = parseInt(currentCount as string, 10) || 0

  if (count >= limit) {
    return { limit, remaining: limit - count, success: false }
  }

  client.incr(key)
  client.expire(key, duration)

  return { limit, remaining: limit - (count + 1), success: true }
}

/**
 * Rate limits actions based on a unique keyword.
 *
 * @param keyword - A unique identifier for the rate limit (e.g., user ID or IP address).
 *
 * @param limit - The maximum number of allowed actions within the specified duration.
 *
 * @param duration - The time window in seconds for which the limit is applied.
 * @returns A promise that resolves to a Result object indicating the rate limit status.
 * @example
 * const result = await rateLimitByKey('user123', 100, 3600);
 * if (!result.success) {
 *   console.log('Rate limit exceeded');
 * }
 */
export const rateLimitByKey = async (
  keyword: string,
  limit: number,
  duration: number
): Promise<Result> => {
  if (env.NODE_ENV === 'test') {
    return { limit, remaining: limit, success: true } as Result
  }

  const key = `rate_limit:${keyword}`

  const result = await rateLimiter(redisClient, key, limit, duration)

  if (!result.success) {
    throw new RateLimitError()
  }

  return result
}

export default rateLimiter
