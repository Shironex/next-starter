import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import SignUpForm from './sign-up-form'

export const metadata = {
  title: 'Register',
  description: 'Register',
}

const SignUpPage = () => {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Register</CardTitle>
        <CardDescription className="text-center">
          Enter your email below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  )
}

export default SignUpPage
