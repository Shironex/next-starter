import { z } from 'zod'

export const signUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignUpSchema = z.infer<typeof signUpSchema>
