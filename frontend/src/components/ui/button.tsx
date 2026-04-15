import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900/20 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-900 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-800 hover:shadow-md hover:shadow-brand-900/25 active:scale-[0.98]",
        secondary:
          "border border-brand-200 bg-white text-brand-900 shadow-sm hover:bg-brand-50 hover:border-brand-300 hover:shadow-md active:scale-[0.98]",
        outline:
          "border border-brand-200 bg-transparent text-brand-900 shadow-sm hover:bg-brand-50 hover:border-brand-300 active:scale-[0.98]",
        ghost:
          "text-brand-700 hover:bg-brand-50 hover:text-brand-900 active:scale-[0.98]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]",
        link: "text-brand-900 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-xl px-4 text-[13px]",
        default: "h-11 rounded-xl px-6 text-sm",
        lg: "h-[52px] rounded-2xl px-8 text-sm",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  pulse?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pulse, ...props }, ref) => {
    return (
      <button
        type={props.type ?? "button"}
        className={cn(
          buttonVariants({ variant, size, className }),
          pulse && "animate-subtle-pulse"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
