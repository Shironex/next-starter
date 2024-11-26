import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getCurrentSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'

import VerifyEmailForm from './verify-email'

export const metadata = {
  title: 'Verify Email',
  description: 'Verify Email Page',
}

const VerifyEmailPage = async () => {
  const { user } = await getCurrentSession()

  if (!user) redirect(redirects.toSignin)

  if (user.emailVerified) redirect(redirects.afterLogin)

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Verify Email</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyEmailForm />
      </CardContent>
    </Card>
  )
}

export default VerifyEmailPage
