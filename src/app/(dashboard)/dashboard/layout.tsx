import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'

import { BaseLayoutProps } from '@/types'

const DashboardLayout = async ({ children }: BaseLayoutProps) => {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect(redirects.toSignin)
  }

  if (!user.emailVerified) {
    return redirect(redirects.toVerify)
  }

  return <div>{children}</div>
}

export default DashboardLayout
