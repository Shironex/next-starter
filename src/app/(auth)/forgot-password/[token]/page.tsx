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

import ResetPasswordForm from './reset-password-form'

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>
}

const ResetPasswordPage = async ({
  params,
}: ResetPasswordPageProps) => {
  const { token } = await params
  const { user } = await getCurrentSession()

  if (user) redirect(redirects.afterLogin)

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter new password and confirm password to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  )
}

export default ResetPasswordPage
