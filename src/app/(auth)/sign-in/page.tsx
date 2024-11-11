import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import SignInForm from './sign-in-form'

export const metadata = {
  title: 'Login',
  description: 'Login',
}

const SignInPage = () => {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
    </Card>
  )
}

export default SignInPage
