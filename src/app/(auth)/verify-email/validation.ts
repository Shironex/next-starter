import { z } from 'zod'

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(8, { message: 'Code must be 8 characters long' })
    .max(8, { message: 'Code must be 8 characters long' }),
})

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
