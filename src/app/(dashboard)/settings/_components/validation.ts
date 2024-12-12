import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email',
  }),
})

export const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(32, {
      message: 'Password can be at most 32 characters long',
    }),

  newPassword: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(32, {
      message: 'Password can be at most 32 characters long',
    }),
})

export const avatarSchema = z.object({
  avatar: z.any().refine((file) => {
    if (!(file instanceof File)) {
      throw new Error('Invalid file type')
    }
    return true
  }),
})

export type emailformValues = z.infer<typeof emailSchema>
export type passwordFormValues = z.infer<typeof passwordSchema>
export type avatarFormValues = z.infer<typeof avatarSchema>
