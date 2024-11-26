import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'

import { BaseLayoutProps } from '@/types'

const MainProjectLayout = async ({ children }: BaseLayoutProps) => {
  const { user } = await getCurrentSession()

  if (!user) {
    redirect(redirects.toSignin)
  }

  if (!user.emailVerified) {
    return redirect(redirects.toVerify)
  }

  //   if (user.registered2FA && !session.twoFactorVerified) {
  //     console.log('redirecting to 2fa')
  //     return redirect(get2FARedirect(account))
  //   }

  return <>{children}</>
}

export default MainProjectLayout
