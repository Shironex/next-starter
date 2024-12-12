import Link from 'next/link'

import { Route } from 'nextjs-routes'

import { Profile, User } from '@/lib/db/schema'

import { AccountRole } from '@/types'

import UserDropdown from './user-dropdown'

type Props = {
  user: User
  role: AccountRole
  profile: Profile
}

type Pathname = Route['pathname']

type NavItem = {
  label: string
  href: Pathname
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'test',
    href: '/',
  },
  {
    label: 'test 2',
    href: '/',
  },
  {
    label: 'test 3',
    href: '/',
  },
]

const Header = ({ user, role, profile }: Props) => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-3">
      <h1>Dashboard</h1>
      <nav>
        <ul className="flex items-center space-x-4">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <UserDropdown user={user} role={role} profile={profile} />
    </header>
  )
}

export default Header
