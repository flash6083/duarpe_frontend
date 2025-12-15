import { NavItem } from '@/types';

export type Product = {
  id: string;
  name: string;
  hsnCode: string;
  summary: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
};

export type Variant = {
  id: string;

  productId: string;
  productName: string; // <-- Added for table display

  categoryId: string;
  categoryName: string; // <-- For filtering

  subcategoryId: string;
  subcategoryName: string;

  details: string;
  unitType: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  unit: number;
  mrp: number;
  gstPercent: number;
  discountedPrice: number;

  thumbnailImage: string; // URL
  images: string[]; // Up to 10 image URLs

  fssaiLicense?: string | null;
  shelfLife?: string | null; // days
  countryOfOrigin?: string | null;
};

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdBy: string;
  password?: string;
};

export type GeoPoint = {
  lat: number;
  long: number;
};

export type Shop = {
  id: string;
  name: string;
  district: string;
  state: string;
  pin: string;
  geoPoint: GeoPoint;
  gstin: string;
  agreementImage: string;
  gstCertificateImage: string;
  shopPanCardImage: string;
  aadharCardImage: string;
  panNumber: string;
  isActive: boolean;
  createdById: string;
  createdByType: string;
  createdAt: string;
  updatedAt: string;
};

export type ShopKeeper = {
  id: string;
  name: string;
  phone: string;
  email: string;
  aadharCardImage: string;
  panCardImage: string;
  profileImage: string;
  isActive: boolean;
  createdById: string;
  createdByType: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  thumbnailImage: string;
  summary: string;
  isActive: boolean;
};

export type subCategory = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  thumbnailImage: string;
  isActive: boolean;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },

  {
    title: 'Variant',
    url: '/dashboard/variant',
    icon: 'variant',
    shortcut: ['v', 'v'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Manage Admins',
    url: '/dashboard/admin',
    icon: 'user2',
    shortcut: ['a', 'a'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Manage Shops',
    url: '/dashboard/shop',
    icon: 'shops',
    shortcut: ['s', 's'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Manage ShopKeepers',
    url: '/dashboard/shopkeeper',
    icon: 'shopKeeper',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Explore Categories',
    url: '/dashboard/category',
    icon: 'category',
    shortcut: ['c', 'c'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Explore Sub-Categories',
    url: '/dashboard/subCategory',
    icon: 'subCategory',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [] // No child items
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
