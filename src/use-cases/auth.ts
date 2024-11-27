import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

import { EmailInUseError, LoginError, PublicError } from '@/lib/errors'
import { sendMail } from '@/lib/mail/nodemailer'
import { renderResetPasswordEmail, renderVerificationCodeEmail } from '@/lib/mail/render'

import { createAccount, getAccountByUserId, updateAccount } from '@/data-access/accounts'
import { hashPassword, verifyPassword } from '@/data-access/auth'
import { createEmailVerificationCode } from '@/data-access/emails'
import { createProfile } from '@/data-access/profiles'
import { createUser, deletePasswordResetCode, findEmailVerificationCode, findPasswordResetCode, findUserByEmail, generatePasswordResetToken, updateUser } from '@/data-access/users'
import { env as envClient } from '@/env/client'
import { env as envServer } from '@/env/server'
import { generateId } from '@/lib/auth'
import { invalidateSession } from '@/lib/auth/session'
import { timeFromNow } from '@/lib/utils'

export const signInUseCase = async (email: string, password: string) => {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new LoginError()
  }

  const account = await getAccountByUserId(user.id)

  if (!account || !account.password) {
    throw new LoginError()
  }

  const isPasswordCorrect = await verifyPassword(account.password, password)

  if (!isPasswordCorrect) {
    throw new LoginError()
  }

  return { id: user.id, verified: user.emailVerified }
}

export const signUpUseCase = async (
  email: string,
  password: string,
  displayName: string
) => {
  if (envServer.ENABLE_SIGNUP_WITH_EMAIL === false) {
    throw new PublicError('Sign up is disabled.')
  }

  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new EmailInUseError()
  }

  const user = await createUser(email)

  const hashedPassword = await hashPassword(password)

  await createAccount(user.id, hashedPassword)

  await createProfile({
    userId: user.id,
    displayName,
  })

  const code = generateRandomString(8, alphabet('0-9')) // 8 digit code

  await createEmailVerificationCode({
    userId: user.id,
    code,
    email: email,
    expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
  })

  await sendMail({
    to: email,
    subject: 'Verify your account',
    body: await renderVerificationCodeEmail({ code }),
  })

  return { id: user.id }
}

export const verifyEmailUseCase = async (
  userId: string,
  email: string,
  code: string
) => {
  const emailVerificationCode = await findEmailVerificationCode(userId)

  if (!emailVerificationCode) {
    throw new PublicError('No verification code found.')
  }

  //? Check if the code is for the user
  if (emailVerificationCode.userId !== userId) {
    throw new PublicError('Invalid code.')
  }

  //? Check if the code is correct
  if (emailVerificationCode.code !== code) {
    throw new PublicError('Invalid code.')
  }

  //? Check if the code is expired
  if (!isWithinExpirationDate(emailVerificationCode.expiresAt)) {
    throw new PublicError('Code expired.')
  }

  //? Check if the email specified in the code is the same as the one used to sign up
  if (emailVerificationCode.email !== email) {
    throw new PublicError('Email does not match.')
  }

  await updateUser(userId, { emailVerified: true })
}

export const sendPasswordResetLinkUseCase = async (email: string) => {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new PublicError('User with this email was not found.')
  }

  if (!user.emailVerified) {
    throw new PublicError(
      'Your email is not verified. Please verify your email first.'
    )
  }

  const lastSend = await findPasswordResetCode(user.id)

  if (lastSend && isWithinExpirationDate(lastSend.expiresAt)) {
    throw new PublicError(
      `Please wait ${timeFromNow(lastSend.expiresAt)} before resending`
    )
  }

  const verificationToken = generateId(40)

  try {
    await generatePasswordResetToken(verificationToken, user.id)

    const verificationLink = `${envClient.NEXT_PUBLIC_APP_URL}/forgot-password/${verificationToken}`

    await sendMail({
      to: user.email,
      subject: 'Reset your password',
      body: await renderResetPasswordEmail({ link: verificationLink }),
    })
  } catch (error) {
    console.error('Error sending password reset link:', error)
    throw new PublicError('Failed to send password reset link.')
  }
}

export const resetPasswordUseCase = async (token: string, password: string) => {
  const dbToken = await deletePasswordResetCode(token)

  if (!dbToken) {
    throw new PublicError('Invalid password reset link.')
  }

  if (!isWithinExpirationDate(dbToken.expiresAt)) {
    throw new PublicError('Password reset link expired.')
  }

  await invalidateSession(dbToken.userId)

  const hashedPassword = await hashPassword(password)

  await updateAccount(dbToken.userId, { password: hashedPassword })
}