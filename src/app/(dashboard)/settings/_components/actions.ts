'use server'

import { revalidatePath } from 'next/cache'

import { updateSession } from '@/lib/auth/session'
import { PublicError } from '@/lib/errors'
import { authenticatedAction } from '@/lib/safe-action'

import {
  updateUserEmailUseCase,
  updateUserPasswordUseCase,
} from '@/use-cases/settings'

import { avatarSchema, emailSchema, passwordSchema } from './validation'

export const updateEmailAction = authenticatedAction
  .createServerAction()
  .input(emailSchema)
  .handler(async ({ input, ctx }) => {
    if (input.email === ctx.user.email) {
      throw new PublicError(
        'The new email cannot be the same as the current email'
      )
    }

    await updateUserEmailUseCase(ctx.user.id, input.email)
    await updateSession(
      ctx.user.id,
      ctx.session.twoFactorVerified,
      ctx.session.id
    )
    revalidatePath('/settings')
  })

export const updatePasswordAction = authenticatedAction
  .createServerAction()
  .input(passwordSchema)
  .handler(async ({ input, ctx }) => {
    if (input.currentPassword === input.newPassword) {
      throw new PublicError('New Password cant be same as current one.')
    }

    await updateUserPasswordUseCase(
      ctx.user.id,
      input.currentPassword,
      input.newPassword
    )

    await updateSession(
      ctx.user.id,
      ctx.session.twoFactorVerified,
      ctx.session.id
    )

    revalidatePath('/settings')
  })

export const updateAvatarAction = authenticatedAction
  .createServerAction()
  .input(avatarSchema)
  .handler(async () => {
    // This is a mock implementation. In a real application, you would update the user's avatar in your database.
    console.log('Updating avatar')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    return { success: true, message: 'Avatar updated successfully' }
  })
