import { PublicError } from '@/lib/errors'

import {
  getAccountByUserId,
  updateAccountPassword,
} from '@/data-access/accounts'
import { hashPassword, verifyPassword } from '@/data-access/auth'
import { updateUserEmail } from '@/data-access/settings'
import { findUserByEmail, findUserById } from '@/data-access/users'

export const updateUserEmailUseCase = async (userId: string, email: string) => {
  const { user } = await findUserById(userId)

  if (!user) {
    throw new PublicError('User not found')
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new PublicError('This email is already taken. Please use other one.')
  }

  await updateUserEmail(user.id, email)
}

export const updateUserPasswordUseCase = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const { user } = await findUserById(userId)

  if (!user) {
    throw new PublicError('User not found')
  }

  const account = await getAccountByUserId(userId)

  if (!account) {
    throw new PublicError('Account not found')
  }

  if (!account.password) {
    throw new PublicError('Password not set')
  }

  const validPassword = verifyPassword(account.password, currentPassword)

  if (!validPassword) {
    throw new PublicError('Incorrect password.')
  }

  const hashedPassword = await hashPassword(newPassword)

  await updateAccountPassword(user.id, hashedPassword)
}
