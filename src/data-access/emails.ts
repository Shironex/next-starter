import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  NewEmailVerificationCode,
  emailVerificationCodes,
} from '@/lib/db/schema'

export async function createEmailVerificationCode(
  data: NewEmailVerificationCode
) {
  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, data.userId))

  return await db.insert(emailVerificationCodes).values({
    ...data,
  })
}
