/* eslint-disable no-console */
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/user-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;
type RoleType = 'superadmin' | 'admin';

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl =
    (searchParams.get('callbackUrl') as string) || '/dashboard/overview';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, startTransition] = useTransition();
  const [localLoading, setLocalLoading] = useState(false);
  const [role, setRole] = useState<RoleType>('superadmin'); // 👈 track which role button was clicked
  const router = useRouter();

  const setUser = useUserStore((s) => s.setUser);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = (data: UserFormValue) => {
    startTransition(async () => {
      setLocalLoading(true);
      try {
        const endpoint =
          role === 'superadmin'
            ? `${process.env.NEXT_PUBLIC_API_URL}/superadmins/auth/login`
            : `${process.env.NEXT_PUBLIC_API_URL}/admins/login`;

        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const payload = await res.json();

        if (res.ok) {
          const serverUser = payload.user ?? null;
          if (serverUser) {
            setUser(serverUser);
          }
          toast.success(`Signed in successfully as ${role}!`);
          router.push(callbackUrl);
        } else {
          toast.error(payload?.message || 'Invalid credentials');
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLocalLoading(false);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    disabled={localLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type='button'
                      className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={localLoading}
            className='w-full cursor-pointer'
            type='submit'
            onClick={() => setRole('superadmin')}
          >
            {localLoading && role === 'superadmin'
              ? 'Signing in...'
              : 'Sign In as SuperAdmin'}
          </Button>

          <Button
            disabled={localLoading}
            className='w-full cursor-pointer'
            type='submit'
            onClick={() => setRole('admin')}
            variant='secondary'
          >
            {localLoading && role === 'admin'
              ? 'Signing in...'
              : 'Sign In as Admin'}
          </Button>
        </form>
      </Form>
    </>
  );
}
