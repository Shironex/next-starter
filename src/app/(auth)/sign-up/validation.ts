import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email'),
  firstName: z
    .string()
    .min(3, 'First name is too short.')
    .max(16, 'First name is too long.'),
  lastName: z
    .string()
    .min(3, 'Last name is too short.')
    .max(16, 'Last name is too long.'),
  password: z
    .string()
    .min(8, 'Password is too short.')
    .max(32, 'Password can be at most 32 characters long.'),
})

export type SignUpSchema = z.infer<typeof signUpSchema>
