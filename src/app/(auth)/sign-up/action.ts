'use server'

import { setSession } from "@/lib/auth/session"
import { redirects } from "@/lib/constants"
import { rateLimitByKey } from "@/lib/ratelimit"
import { unauthenticatedAction } from "@/lib/safe-action"
import { signUpUseCase } from "@/use-cases/auth"
import { redirect } from "next/navigation"
import { signUpSchema } from "./validation"

export const signUpAction = unauthenticatedAction.createServerAction().input(signUpSchema).handler(async ({input}) => {
    await rateLimitByKey(`${input.email}-signup`, 5, 120)

    const { id } = await signUpUseCase(
      input.email,
      input.password,
      input.firstName + " " + input.lastName
    )

    await setSession(id, false)

    redirect(redirects.toVerify)
})