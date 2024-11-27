'use client'

import { useServerAction } from 'zsa-react'

import { LoadingButton } from '@/components/loading-button'

import { logoutAction } from '../action'

type LogOutButtonProps = {
  isPending: boolean
}

const LogOutButton = ({ isPending }: LogOutButtonProps) => {
  const { execute: logoutExecute, isPending: logoutIsPending } =
    useServerAction(logoutAction)

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
