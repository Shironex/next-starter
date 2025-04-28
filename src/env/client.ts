/* eslint-disable n/no-process-env */
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  onValidationError: (issues) => {
    console.error('❌ Invalid environment variables:', issues)
    throw new Error('Invalid environment variables')
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable: ${variable} on the client`,
    )
  },
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: false,
})
