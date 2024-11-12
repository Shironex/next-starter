import { eq } from 'drizzle-orm'

import { generateId } from '@/lib/auth'
import { db } from '@/lib/db'
import { NewProfile, Profile, profiles } from '@/lib/db/schema'

export async function createProfile(data: NewProfile) {
  const [profile] = await db
    .insert(profiles)
    .values({
      id: generateId(21),
      ...data,
    })
    .onConflictDoNothing()
    .returning()
  return profile
}

export async function updateProfile(
  userId: string,
  updateProfile: Partial<Profile>
) {
  await db
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId))
}

export async function getProfile(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  return profile
}

export async function getProfileByDisplayName(displayName: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.displayName, displayName),
  })

  return profile
}
