import { z } from 'zod'

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Invalid token'),
  password: z.string().min(8, 'Password is too short').max(255),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
