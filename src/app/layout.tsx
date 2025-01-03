import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Next.js Starter Template',
  description: 'Next.js Starter Template',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
