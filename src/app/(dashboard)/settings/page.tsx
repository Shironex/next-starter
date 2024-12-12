import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import EmailForm from './_components/email-form'
import PasswordForm from './_components/password-form'

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Account Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailForm />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage
