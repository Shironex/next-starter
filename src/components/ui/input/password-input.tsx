'use client'

import { forwardRef, useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'

import { cn } from '@/lib/utils'

interface PasswordInputProps extends InputProps {
  icon?: boolean
  placeholder?: string
}

const PasswordInputComponent = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
          placeholder={placeholder}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={
            'absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
          }
          data-cy="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.value === '' || props.disabled}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    )
  }
)

PasswordInputComponent.displayName = 'PasswordInput'

export const PasswordInput = PasswordInputComponent
