import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'
import { BaseLayoutProps } from '@/types'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Next.js Starter Template',
  description: 'Next.js Starter Template',
}

export default function RootLayout({
  children,
}: BaseLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
