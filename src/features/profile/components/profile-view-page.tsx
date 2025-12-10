'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user-store';
import { LogOut } from 'lucide-react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfileViewPage() {
  // Read user from Zustand store
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);
  const router = useRouter();
  const { clearUser } = useUserStore();

  // While Zustand restores persisted state
  if (!hydrated) return <FormCardSkeleton />;

  if (!user)
    return (
      <div className='p-4'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>User not found. Please re-login.</AlertDescription>
        </Alert>
      </div>
    );

  const fullName = `${user.firstName} ${user.lastName}`;
  const avatarUrl = user?.image
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.image}`
    : undefined;

  return (
    <div className='flex w-full flex-col p-4 md:p-8'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Left Section */}
        <Card className='md:col-span-1'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16'>
                {user.image ? (
                  <AvatarImage src={avatarUrl} alt={fullName} />
                ) : (
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <CardTitle className='text-xl'>{fullName}</CardTitle>
                <p className='text-muted-foreground text-sm'>{user.email}</p>

                <Badge variant='default' className='mt-2'>
                  {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Separator className='my-4' />

            <div className='space-y-2 text-sm'>
              <p>
                <span className='font-medium'>User ID: </span>
                {user.id}
              </p>

              <p>
                <span className='font-medium'>Role: </span>
                {user.role}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Section */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* EMAIL */}
            <div>
              <p className='text-sm font-medium'>Email address</p>
              <p className='text-muted-foreground text-sm'>{user.email}</p>
            </div>

            <Separator />

            {/* NAME */}
            <div>
              <p className='text-sm font-medium'>Full Name</p>
              <p className='text-muted-foreground text-sm'>{fullName}</p>
            </div>

            <Separator />

            {/* CONNECTED ACCOUNTS placeholder */}
            <div>
              <p className='text-sm font-medium'>Connected Accounts</p>
              <p className='text-muted-foreground text-sm'>
                No connected accounts
              </p>
            </div>
          </CardContent>
        </Card>
        {/* SIGN OUT SECTION */}
        <div className='pt-2'>
          <Button
            variant='destructive'
            className='flex w-full cursor-pointer items-center gap-2'
            onClick={async () => {
              try {
                if (user.role === 'superadmin') {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/superadmins/auth/logout`,
                    {
                      method: 'GET',
                      credentials: 'include'
                    }
                  );
                } else if (user.role === 'admin') {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admins/logout`,
                    {
                      method: 'GET',
                      credentials: 'include'
                    }
                  );
                }
              } catch (err) {
                toast.error('Error logging out. Please try again.');
                console.error('logout error', err);
              } finally {
                clearUser();
                router.push('/auth/sign-in');
              }
            }}
          >
            <LogOut className='h-4 w-4' />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
