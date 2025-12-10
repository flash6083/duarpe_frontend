/* eslint-disable no-console */
'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useUserStore } from '@/stores/user-store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
export function UserNav() {
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);
  const loading = useUserStore((s) => s.loading);
  const clearUser = useUserStore((s) => s.clearUser);
  const router = useRouter();
  // ✅ Guard hydration & loading
  if (!hydrated || loading) {
    return <Loader2 className='h-5 w-5 animate-spin' />;
  }
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <UserAvatarProfile className='cursor-pointer' user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {user.firstName} {user.lastName}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>

            {user.role === 'superadmin' && (
              <DropdownMenuItem onClick={() => router.push('/dashboard/admin')}>
                Manage Admins
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => router.push('/dashboard/shop')}>
              Shops
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/dashboard/shopkeeper')}
            >
              ShopKeepers
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/dashboard/category')}
            >
              Categories
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/dashboard/subCategory')}
            >
              Sub-Categories
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
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
                console.error('logout error', err);
              } finally {
                clearUser();
                router.push('/auth/sign-in');
              }
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
