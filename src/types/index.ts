export interface BaseLayoutProps
  extends Readonly<{
    children: React.ReactNode
  }> {
}

export type AccountRole = 'admin' | 'user'
