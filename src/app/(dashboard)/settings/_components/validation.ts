import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters',
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
