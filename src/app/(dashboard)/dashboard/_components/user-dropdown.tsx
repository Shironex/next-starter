'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Profile, User } from '@/lib/db/schema'

import { logoutAction } from '@/app/(auth)/verify-email/action'
import { AccountRole } from '@/types'

type Props = {
  user: User
  role: AccountRole
  profile: Profile
}

const UserDropdown = ({ user, role, profile }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          data-cy="btn-user-dropdown"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile.avatarUrl ?? '/avatars/1.png'}
              alt="@shadcn"
            />
            <AvatarFallback>
              {profile.displayName?.[0]}
              {profile.displayName?.[profile.displayName.length - 1]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.displayName}
            </p>
            <p
              className="text-xs leading-none text-muted-foreground"
              data-cy="user-email"
            >
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href="/"
              className="h-full w-full"
              onClick={() => setOpen(false)}
            >
              Home page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/settings"
              className="h-full w-full"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-cy="logout-btn"
          onClick={async () => {
            await logoutAction()
            setOpen(false)
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
