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
import { Input } from '@/components/ui/input'

import { LoadingButton } from '@/components/loading-button'

import { useToast } from '@/hooks/use-toast'

import { sendPasswordResetLinkAction } from './action'
import { SendResetEmailInput, sendResetEmailSchema } from './validation'

const SendResetEmailForm = () => {
  const { toast } = useToast()
  const form = useForm<SendResetEmailInput>({
    resolver: zodResolver(sendResetEmailSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const { executeAsync, isPending } = useAction(sendPasswordResetLinkAction, {
    onSuccess: () => {
      toast({
        title: 'Email sent',
        description: 'A password reset link has been sent to your email.',
      })
    },
    onError: ({ error }) => {
      toast({
        title: 'Error',
        description: error.serverError,
      })
    },
  })

  const handleSubmit: () => void = form.handleSubmit(
    async (data: SendResetEmailInput) => {
      await executeAsync(data)
    }
  )

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="email@example.com"
                  autoComplete="email"
                  type="email"
                  data-cy="email-input"
                  {...field}
                />
              </FormControl>
              <FormMessage data-cy="error-message-email" />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          className="w-full rounded-full"
          data-cy="reset-password-btn"
        >
          Reset Password
          <span className="ml-1 tracking-normal transition-transform duration-150 ease-in-out group-hover:translate-x-0.5">
            -&gt;
          </span>
        </LoadingButton>
      </form>
    </Form>
  )
}

export default SendResetEmailForm
