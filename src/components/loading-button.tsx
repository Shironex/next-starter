'use client'

import { SVGProps, forwardRef } from 'react'

import { VariantProps } from 'class-variance-authority'

import {
  Button,
  type ButtonProps,
  IconProps,
  buttonVariants,
} from '@/components/ui/button'

import { cn } from '@/lib/utils'

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  spanClassName?: string
  ClassName?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  iconprops?: IconProps
}

const AnimatedSpinner = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      {...props}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      data-cy="animated-spinner"
      className={cn(className)}
    >
      <g className="animated-spinner">
        <rect x="11" y="1" width="2" height="5" opacity=".14" />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(30 12 12)"
          opacity=".29"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(60 12 12)"
          opacity=".43"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(90 12 12)"
          opacity=".57"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(120 12 12)"
          opacity=".71"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(150 12 12)"
          opacity=".86"
        />
        <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
      </g>
    </svg>
  )
)
AnimatedSpinner.displayName = 'AnimatedSpinner'

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      loading = false,
      className,
      children,
      ClassName,
      spanClassName,
      variant,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        {...props}
        variant={variant ?? 'default'}
        disabled={props.disabled ? props.disabled : loading}
        className={cn(className, ClassName, 'relative')}
      >
        <span className={cn(spanClassName, loading ? 'opacity-0' : '')}>
          {children}
        </span>
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <AnimatedSpinner className="h-6 w-6 animate-spin" />
          </div>
        ) : null}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export { AnimatedSpinner, LoadingButton }
