import { BaseLayoutProps } from '@/types'

export default function RootLayout({ children }: BaseLayoutProps) {
  return (
    <main className="flex h-screen items-center justify-center p-1">
      {children}
    </main>
  )
}
