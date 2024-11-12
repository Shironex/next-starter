'use client'

import Link from 'next/link'

import { zodResolver } from '@hookform/resolvers/zod'
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

import { SignUpSchema, signUpSchema } from './validation'

const SignUpForm = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignUpSchema) => {
    console.log(data)
  }
  return (
    <div>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">
                    first Name
                    <span className="ml-1 text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      required
                      placeholder="John"
                      autoComplete="first-name"
                      aria-required
                      type="text"
                      data-cy="first-name-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="error-message-email" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastName">
                    Last Name
                    <span className="ml-1 text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="lastName"
                      required
                      placeholder="John"
                      autoComplete="first-name"
                      aria-required
                      type="text"
                      data-cy="last-name-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage data-cy="error-message-email" />
                </FormItem>
              )}
            />
          </div>
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
                <FormLabel htmlFor="password">
                  Password
                  <span className="ml-1 text-rose-500">*</span>
                </FormLabel>
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
            disabled={false}
            loading={false}
            variant={'expandIcon'}
            className="w-full rounded-full"
            data-cy="register-btn"
          >
            Sign Up
          </LoadingButton>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <div className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            className="font-medium text-muted-foreground transition duration-150 ease-in-out hover:text-primary"
            href={redirects.toSignin}
          >
            Sign in
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
          href={{
            pathname: '/api/login/google',
          }}
          className="flex items-center justify-center"
        >
          <GoogleIcon />
        </Link>
        <Link
          href={{
            pathname: '/api/login/github',
          }}
          className="flex items-center justify-center"
        >
          <GithubIcon />
        </Link>
      </div>
    </div>
  )
}

export default SignUpForm