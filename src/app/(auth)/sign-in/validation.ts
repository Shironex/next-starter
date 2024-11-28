import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password is too short.')
    .max(32, 'Password can be at most 32 characters long.'),
})

export type SignInInput = z.infer<typeof signInSchema>
