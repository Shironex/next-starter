import { BaseLayoutProps } from '@/types'

export const metadata = {
  title: 'Login',
  description: 'Login',
}

export default function RootLayout({ children }: BaseLayoutProps) {
  return (
    <main className="flex h-screen items-center justify-center">
      {children}
    </main>
  )
}
