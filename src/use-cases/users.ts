import { UserNotFoundError } from '@/lib/errors'

import { GitHubUser } from '@/app/api/login/github/callback/route'
import { GoogleUser } from '@/app/api/login/google/callback/route'
import {
  createAccountViaGithub,
  createAccountViaGoogle,
} from '@/data-access/accounts'
import { createProfile, getProfile } from '@/data-access/profiles'
import { createUser, findUserByEmail } from '@/data-access/users'

export async function createGithubUserUseCase(githubUser: GitHubUser) {
  let existingUser = await findUserByEmail(githubUser.email)

  if (!existingUser) {
    existingUser = await createUser(githubUser.email, true)
  }

  await createAccountViaGithub(existingUser.id, githubUser.id)

  await createProfile({
    userId: existingUser.id,
    displayName: githubUser.login,
    avatarUrl: githubUser.avatar_url,
  })

  return existingUser.id
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await findUserByEmail(googleUser.email)

  if (!existingUser) {
    existingUser = await createUser(googleUser.email, true)
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub)

  await createProfile({
    userId: existingUser.id,
    displayName: googleUser.name,
    avatarUrl: googleUser.picture,
  })

  return existingUser.id
}

export async function getUserProfileUseCase(userId: string) {
  const profile = await getProfile(userId)

  if (!profile) {
    throw new UserNotFoundError()
  }

  return profile
}
