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

import SendResetEmailForm from './send-reset-email-form'

export const metadata = {
  title: 'Forgot Password',
  description: 'Forgot Password Page',
}

const ForgotPasswordPage = async () => {
  const { user } = await getCurrentSession()

  if (user) redirect(redirects.afterLogin)

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Forgot Passowrd</CardTitle>
        <CardDescription>
          Enter your email address to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetEmailForm />
      </CardContent>
    </Card>
  )
}

export default ForgotPasswordPage
