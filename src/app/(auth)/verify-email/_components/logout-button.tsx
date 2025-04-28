'use client'

import { useAction } from 'next-safe-action/hooks'

import { LoadingButton } from '@/components/loading-button'

import { logoutAction } from '../action'

type LogOutButtonProps = {
  isPending: boolean
}

const LogOutButton = ({ isPending }: LogOutButtonProps) => {
  const { execute: logoutExecute, isPending: logoutIsPending } =
    useAction(logoutAction)

  return (
    <form
      onSubmit={() => {
        logoutExecute()
      }}
    >
      <LoadingButton
        disabled={isPending || logoutIsPending}
        variant="link"
        className="rounded-full p-0 font-normal"
      >
        want to use another email? Log out now.
      </LoadingButton>
    </form>
  )
}

export default LogOutButton
