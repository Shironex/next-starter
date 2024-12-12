import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/lib/auth/session'
import { redirects } from '@/lib/constants'

import { BaseLayoutProps } from '@/types'
import { getUserProfileUseCase } from '@/use-cases/users'

import Header from './dashboard/_components/header'

const MainProjectLayout = async ({ children }: BaseLayoutProps) => {
  const { user, account } = await getCurrentSession()

  if (!user) {
    redirect(redirects.toSignin)
  }

  if (!user.emailVerified) {
    return redirect(redirects.toVerify)
  }

  const profile = await getUserProfileUseCase(user.id)

  return (
    <div>
      <Header user={user} role={account.role} profile={profile} />

      {children}
    </div>
  )
}

export default MainProjectLayout
