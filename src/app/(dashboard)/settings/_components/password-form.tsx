'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { PasswordInput } from '@/components/ui/input/password-input'

import { LoadingButton } from '@/components/loading-button'

import { toast } from '@/hooks/use-toast'

import { updatePasswordAction } from './actions'
import { passwordFormValues, passwordSchema } from './validation'

export default function PasswordForm() {
  const form = useForm<passwordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  })

  const { execute, isPending } = useServerAction(updatePasswordAction, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      })
      form.reset()
    },
    onError: ({ err }) => {
      toast({
        title: 'Error',
        description: err.message,
      })
    },
  })

  const handleSubmit = async (data: passwordFormValues) => await execute(data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="current-password">
                  Current PasswordF
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="current-password"
                    placeholder="Enter your current password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="new-password">New PasswordF</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="new-password"
                    placeholder="Enter your new password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton
          type="submit"
          className="w-full rounded-xl sm:w-auto"
          disabled={isPending}
          loading={isPending}
        >
          Update Password
        </LoadingButton>
      </form>
    </Form>
  )
}
