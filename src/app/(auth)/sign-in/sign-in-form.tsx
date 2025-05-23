'use client'

import Link from 'next/link'

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
import { PasswordInput } from '@/components/ui/input/password-input'

import { GithubIcon, GoogleIcon } from '@/components/icons'
import { LoadingButton } from '@/components/loading-button'

import { redirects } from '@/lib/constants'

import { toast } from '@/hooks/use-toast'

import { signInAction } from './action'
import { SignInInput, signInSchema } from './validation'

const SignInForm = () => {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { executeAsync, isPending } = useAction(signInAction, {
    onError({ error }) {
      toast({
        title: 'Something went wrong',
        description: error.serverError,
        variant: 'destructive',
      })
    },
    onSuccess() {
      toast({
        title: 'Logged in',
        description: 'Enjoy your project management',
      })
    },
  })

  const handleSubmit = form.handleSubmit(
    async (data) => await executeAsync(data)
  )

  return (
    <div>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">
                  Email
                  <span className="ml-1 text-rose-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    required
                    placeholder="email@example.com"
                    autoComplete="email"
                    aria-required
                    type="email"
                    data-cy="email-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy="error-message-email" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel htmlFor="password">
                    Password
                    <span className="ml-1 text-rose-500">*</span>
                  </FormLabel>
                  <Link
                    data-cy="forgot-password-link"
                    className="ml-2 text-sm font-medium text-muted-foreground transition duration-150 ease-in-out hover:text-primary"
                    href={redirects.toForgotPassword}
                  >
                    Forgot?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    id="password"
                    required
                    placeholder="********"
                    autoComplete="current-password"
                    data-cy="password-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy="error-message-password" />
              </FormItem>
            )}
          />
          <LoadingButton
            disabled={isPending}
            loading={isPending}
            variant={'shine'}
            className="w-full rounded-full"
            data-cy="sign-in-btn"
          >
            Sign In
          </LoadingButton>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <div className="text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            className="font-medium text-muted-foreground transition duration-150 ease-in-out hover:text-primary"
            href={redirects.toSignup}
          >
            Sign up
          </Link>
        </div>
      </div>
      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="mr-3 grow border-t border-primary" aria-hidden="true" />
        <div className="text-sm italic text-slate-500">or</div>
        <div className="ml-3 grow border-t border-primary" aria-hidden="true" />
      </div>
      {/* Social login */}
      <div className="flex items-center justify-between space-x-3 px-14">
        <Link
          href={'/api/login/google'}
          className="flex items-center justify-center"
        >
          <GoogleIcon />
        </Link>
        <Link
          href={'/api/login/github'}
          className="flex items-center justify-center"
        >
          <GithubIcon />
        </Link>
      </div>
    </div>
  )
}

export default SignInForm
