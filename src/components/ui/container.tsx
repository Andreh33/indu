import { cn } from '@/lib/utils/cn';

type ContainerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'max';
  className?: string;
  children: React.ReactNode;
};

const SIZES: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-[var(--container-sm)]',
  md: 'max-w-[var(--container-md)]',
  lg: 'max-w-[var(--container-lg)]',
  xl: 'max-w-[var(--container-xl)]',
  '2xl': 'max-w-[var(--container-2xl)]',
  max: 'max-w-[var(--container-max)]',
};

export default function Container({ size = 'xl', className, children }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-6 md:px-10 lg:px-16', SIZES[size], className)}>
      {children}
    </div>
  );
}
