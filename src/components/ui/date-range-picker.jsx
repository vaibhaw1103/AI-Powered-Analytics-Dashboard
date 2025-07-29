import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DateRangePicker = React.forwardRef(({ className, startDate, endDate, onStartDateChange, onEndDateChange, ...props }, ref) => {
  return (
    <div className={cn("flex items-center gap-2", className)} ref={ref} {...props}>
      <div className="relative">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange?.(e.target.value)}
          className="pr-10"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted)' }} />
      </div>
      <span style={{ color: 'var(--muted)' }}>to</span>
      <div className="relative">
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange?.(e.target.value)}
          className="pr-10"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted)' }} />
      </div>
    </div>
  )
})
DateRangePicker.displayName = "DateRangePicker"

export { DateRangePicker }
