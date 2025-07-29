import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const getVariantStyles = (variant) => {
  switch (variant) {
    case 'default':
      return {
        backgroundColor: 'var(--primary)',
        color: 'white',
        ':hover': { backgroundColor: 'var(--primary-dark)' }
      }
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: 'var(--border)',
        border: '1px solid',
        color: 'var(--foreground)',
        ':hover': { backgroundColor: 'var(--card-hover)' }
      }
    case 'secondary':
      return {
        backgroundColor: 'var(--card-hover)',
        color: 'var(--foreground)',
        ':hover': { opacity: 0.8 }
      }
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: 'var(--foreground)',
        ':hover': { backgroundColor: 'var(--card-hover)' }
      }
    case 'destructive':
      return {
        backgroundColor: 'var(--error)',
        color: 'white',
        ':hover': { opacity: 0.9 }
      }
    default:
      return {
        backgroundColor: 'var(--primary)',
        color: 'white'
      }
  }
}

const Button = React.forwardRef(({ className, variant, size, asChild = false, style = {}, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const variantStyles = getVariantStyles(variant)
  
  const handleMouseEnter = (e) => {
    if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
      e.target.style.backgroundColor = 'var(--card-hover)'
    } else if (variant === 'default') {
      e.target.style.backgroundColor = 'var(--primary-dark)'
    }
    onMouseEnter?.(e)
  }
  
  const handleMouseLeave = (e) => {
    if (variant === 'outline' || variant === 'ghost') {
      e.target.style.backgroundColor = 'transparent'
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = 'var(--card-hover)'
    } else if (variant === 'default') {
      e.target.style.backgroundColor = 'var(--primary)'
    }
    onMouseLeave?.(e)
  }
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      style={{
        ...variantStyles,
        '--ring-color': 'var(--primary)',
        ...style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      {...props} />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }