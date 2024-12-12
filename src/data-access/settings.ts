import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export async function updateUserEmail(userId: string, email: string) {
  return await db
    .update(users)
    .set({
      email,
    })
    .where(eq(users.id, userId))
    .returning()
}
