import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from './user-auth-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Login
      </Link>

      {/* --------------------------- LEFT PANEL --------------------------- */}
      <div className='relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex dark:border-r'>
        {/* Background base */}
        <div className='absolute inset-0 bg-zinc-900' />

        {/* Subtle gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black/70 mix-blend-screen' />

        {/* Abstract illustration */}
        <div className='absolute inset-0 opacity-45'>
          <svg
            width='100%'
            height='100%'
            viewBox='0 0 800 800'
            preserveAspectRatio='xMidYMid slice'
          >
            <defs>
              <radialGradient id='blob1' cx='20%' cy='20%' r='60%'>
                <stop offset='0%' stopColor='#6366f1' />
                <stop offset='100%' stopColor='transparent' />
              </radialGradient>
              <radialGradient id='blob2' cx='80%' cy='80%' r='60%'>
                <stop offset='0%' stopColor='#a855f7' />
                <stop offset='100%' stopColor='transparent' />
              </radialGradient>
            </defs>
            <rect width='800' height='800' fill='url(#blob1)' />
            <rect width='800' height='800' fill='url(#blob2)' />
          </svg>
        </div>

        {/* Branding */}
        <div className='relative z-20 flex items-center text-lg font-semibold tracking-tight'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <circle cx='12' cy='12' r='9' />
            <path d='M9 12l2 2 4-4' />
          </svg>
          Duarpe
        </div>

        {/* Meaningful Purpose-driven Content */}
        <div className='relative z-20 mt-auto max-w-sm space-y-4'>
          <h2 className='text-3xl font-semibold'>Empowering rural commerce.</h2>

          <p className='text-sm leading-relaxed text-zinc-300'>
            Duarpe provides a unified platform for local restaurants, delivery
            partners, and small businesses in rural regions to manage orders,
            track deliveries, and grow their operations with ease.
          </p>

          <p className='text-sm leading-relaxed text-zinc-300'>
            Seamless tools built to support on-ground logistics, improve
            efficiency, and bring digital convenience closer to every village.
          </p>
        </div>
      </div>
      {/* --------------------------- END LEFT PANEL --------------------------- */}

      {/* --------------------------- RIGHT PANEL (LOGIN) --------------------------- */}
      <div className='flex h-full flex-col items-center justify-center p-4 lg:p-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome back
          </h1>
          <p className='text-muted-foreground text-sm'>
            Sign in to your account to continue
          </p>
        </div>

        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <UserAuthForm />

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      {/* --------------------------- END RIGHT PANEL --------------------------- */}
    </div>
  );
}
