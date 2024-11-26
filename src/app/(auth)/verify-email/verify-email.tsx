'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useForm } from 'react-hook-form'
import { useServerAction } from 'zsa-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

import { LoadingButton } from '@/components/loading-button'

import { useToast } from '@/hooks/use-toast'

import LogOutButton from './_components/logout-button'
import { verifyEmailAction } from './action'
import { VerifyEmailInput, verifyEmailSchema } from './validation'

const VerifyEmailForm = () => {
  const { toast } = useToast()

  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  })

  const { execute, isPending } = useServerAction(verifyEmailAction, {
    onSuccess: () => {
      toast({
        title: 'Email verified',
        description: 'You can now use your account',
      })
    },
    onError: ({ err }) => {
      toast({
        title: 'Something went wrong',
        description: err.message,
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = form.handleSubmit((data: VerifyEmailInput) =>
    execute(data)
  )

  return (
    <div className="flex flex-col gap-2">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={8}
                    className="mt-2"
                    pattern={REGEXP_ONLY_DIGITS}
                    data-cy="otp-input"
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            loading={isPending}
            data-cy="verify-btn"
            className="mt-4 w-full text-white"
          >
            Verify
          </LoadingButton>
        </form>
      </Form>
      <LogOutButton isPending={isPending} />
    </div>
  )
}

export default VerifyEmailForm
