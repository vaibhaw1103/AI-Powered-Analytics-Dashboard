import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, style = {}, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-2 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
        '--placeholder-color': 'var(--muted)',
        '--focus-ring-color': 'var(--primary)',
        ...style
      }}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }