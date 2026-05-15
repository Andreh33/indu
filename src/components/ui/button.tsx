import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-3',
    'font-display uppercase tracking-[0.06em]',
    'select-none whitespace-nowrap',
    'transition-[background-color,color,border-color,transform] duration-[var(--duration-base)]',
    '[transition-timing-function:var(--ease-fight)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blood-400)]',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-blood-400)] text-[var(--color-canvas-0)] hover:bg-[var(--color-blood-300)]',
        outline:
          'border border-[var(--color-canvas-300)] text-[var(--color-canvas-0)] hover:border-[var(--color-blood-400)] hover:text-[var(--color-blood-300)]',
        ghost: 'text-[var(--color-canvas-0)] hover:text-[var(--color-blood-300)]',
        whatsapp:
          'bg-[#25D366] text-white hover:bg-[#1FB957]',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-base',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
});

export default Button;
export { buttonVariants };
