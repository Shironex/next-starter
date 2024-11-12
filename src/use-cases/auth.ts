import { TimeSpan, createDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

import { EmailInUseError, LoginError, PublicError } from '@/lib/errors'
import { sendMail } from '@/lib/mail/nodemailer'
import { renderVerificationCodeEmail } from '@/lib/mail/render'

import { createAccount, getAccountByUserId } from '@/data-access/accounts'
import { hashPassword, verifyPassword } from '@/data-access/auth'
import { createEmailVerificationCode } from '@/data-access/emails'
import { createProfile } from '@/data-access/profiles'
import { createUser, findUserByEmail } from '@/data-access/users'
import { env } from '@/env/server'

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
  if (env.ENABLE_SIGNUP_WITH_EMAIL === false) {
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
