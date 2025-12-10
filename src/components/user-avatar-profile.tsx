import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image?: string | number;
    role: string;
  };
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps) {
  const avatarUrl = user?.image
    ? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.image}`
    : undefined;
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={user?.firstName || 'User avatar'}
            width={40}
            height={40}
            className='rounded-full'
          />
        ) : (
          <AvatarFallback className='rounded-lg'>
            {user?.firstName?.slice(0, 2)?.toUpperCase() || 'CN'}
          </AvatarFallback>
        )}
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>
            {user?.firstName || ''}
          </span>
          <span className='truncate text-xs'>{user?.email || ''}</span>
        </div>
      )}
    </div>
  );
}
