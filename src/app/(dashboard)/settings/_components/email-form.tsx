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
import { Input } from '@/components/ui/input'

import { LoadingButton } from '@/components/loading-button'

import { toast } from '@/hooks/use-toast'

import { updateEmailAction } from './actions'
import { emailSchema, emailformValues } from './validation'

export default function EmailForm() {
  const form = useForm<emailformValues>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  })

  const { execute, isPending } = useServerAction(updateEmailAction, {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Email updated successfully',
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

  const handleSubmit = async (data: emailformValues) => await execute(data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">New Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your new email"
                  data-cy="email-input"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage data-cy="error-message-email" />
            </FormItem>
          )}
        />

        <LoadingButton
          disabled={isPending}
          loading={isPending}
          type="submit"
          className="w-full rounded-xl sm:w-auto"
          data-cy="btn-submit"
        >
          Update Email
        </LoadingButton>
      </form>
    </Form>
  )
}
