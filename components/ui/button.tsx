import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-escape-red text-white hover:bg-escape-red-700 active:bg-escape-red-800",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-escape-red text-escape-red bg-transparent hover:bg-escape-red hover:text-white active:bg-escape-red-700",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        ghost:
          "text-escape-red hover:bg-escape-red/10 active:bg-escape-red/20",
        link: "text-escape-red underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm has-[>svg]:px-5",
        sm: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
        lg: "h-14 px-8 py-4 text-base has-[>svg]:px-6",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
