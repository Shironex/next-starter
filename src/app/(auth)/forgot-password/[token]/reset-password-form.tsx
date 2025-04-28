'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/input/password-input'

import { LoadingButton } from '@/components/loading-button'

import { useToast } from '@/hooks/use-toast'

import { resetPasswordAction } from './action'
import { ResetPasswordInput, resetPasswordSchema } from './validation'

type ResetPasswordFormProps = {
  token: string
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { toast } = useToast()
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      token: token,
      password: '',
    },
  })

  const { executeAsync, isPending } = useAction(resetPasswordAction, {
    onError({ error }) {
      toast({
        title: 'Error resetting password',
        description: error.serverError,
      })
    },
    onSuccess() {
      toast({
        title: 'Password reset successfully',
        description: 'Please login with your new password',
      })
    },
  })

  const handleSubmit = form.handleSubmit(
    async (data: ResetPasswordInput) => await executeAsync(data)
  )

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  required
                  autoComplete="new-password"
                  placeholder="********"
                  data-cy="password-input"
                  icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          disabled={isPending}
          loading={isPending}
          className="w-full rounded-full"
          data-cy="confirm-password-btn"
        >
          Reset Password
        </LoadingButton>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
