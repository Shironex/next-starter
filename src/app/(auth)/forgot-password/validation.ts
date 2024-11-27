import { z } from 'zod'

export const sendResetEmailSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
})

export type SendResetEmailInput = z.infer<typeof sendResetEmailSchema>
