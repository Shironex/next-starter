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
  .metadata({
    actionName: 'update-email',
    role: 'user',
  })
  .schema(emailSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (parsedInput.email === ctx.user.email) {
      throw new PublicError(
        'The new email cannot be the same as the current email'
      )
    }

    await updateUserEmailUseCase(ctx.user.id, parsedInput.email)
    await updateSession(
      ctx.user.id,
      ctx.session.twoFactorVerified,
      ctx.session.id
    )
    revalidatePath('/settings')
  })

export const updatePasswordAction = authenticatedAction
  .metadata({
    actionName: 'update-password',
    role: 'user',
  })
  .schema(passwordSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (parsedInput.currentPassword === parsedInput.newPassword) {
      throw new PublicError(
        'The new password cannot be the same as the current password'
      )
    }

    await updateUserPasswordUseCase(
      ctx.user.id,
      parsedInput.currentPassword,
      parsedInput.newPassword
    )

    await updateSession(
      ctx.user.id,
      ctx.session.twoFactorVerified,
      ctx.session.id
    )

    revalidatePath('/settings')
  })

export const updateAvatarAction = authenticatedAction
  .metadata({
    actionName: 'update-avatar',
    role: 'user',
  })
  .schema(avatarSchema)
  .action(async ({ parsedInput: _parsedInput, ctx: _ctx }) => {
    // This is a mock implementation. In a real application, you would update the user's avatar in your database.
    console.log('Updating avatar')
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    return { success: true, message: 'Avatar updated successfully' }
  })
