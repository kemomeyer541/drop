import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { cn } from "./utils"

export const badgeVariants = cva(
  // base
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        accent:
          "text-foreground bg-accent hover:bg-accent-foreground/10",
        // NEW 🔽
        ad: [
          "bg-[#FFB039]",              // brand gold
          "text-zinc-900 dark:text-black",
          "border border-[#FFC466]/40",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)]",
          "hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#FFB039]",
          "pointer-events-none",       // pill is non-interactive
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    title?: string
  }

export function Badge({
  className,
  variant,
  asChild = false,
  title,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  // If a title is provided, show a tooltip and keep native title for a11y
  if (title && !asChild) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Comp
              data-slot="badge"
              className={cn(badgeVariants({ variant }), className)}
              title={title}
              aria-label={title}
              {...props}
            >
              {children}
            </Comp>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      title={title}
      aria-label={title}
      {...props}
    >
      {children}
    </Comp>
  )
}

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>
export { badgeVariants as default }