export interface BaseLayoutProps
  extends Readonly<{
    children: React.ReactNode
  }> {
  params?: Record<string, string>
}
