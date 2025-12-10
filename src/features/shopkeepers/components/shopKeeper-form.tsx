/* eslint-disable no-console */
'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { ShopKeeper } from '@/constants/data';
import { formatDate } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// 🧩 Helper: validates both File[] and existing string URLs
const fileField = (fieldName: string) =>
  z.any().refine(
    (files) => {
      // 🟢 If it's a string (already uploaded image URL) — skip all file checks
      if (typeof files === 'string') return true;

      // 🟢 If it's an array of strings (like [url]) — also fine
      if (Array.isArray(files) && typeof files[0] === 'string') return true;

      // 🔴 If nothing provided
      if (!files || files.length === 0) return false;

      const file = files[0];

      // 🟢 Must be a valid File
      if (!(file instanceof File)) return false;

      // 🟢 Validate size and type
      return (
        file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    },
    {
      message: `${fieldName} must be a valid image (jpg, jpeg, png, webp) under 5MB`
    }
  );

export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Shopkeeper name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .length(10, { message: 'Phone number must be exactly 10 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
  isActive: z.boolean(),
  createdById: z.string().optional(),
  createdByType: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),

  // 🖼️ File fields (using the helper)
  aadharCardImage: fileField('Aadhar card image'),
  panCardImage: fileField('Shopkeeper PAN card image'),
  profileImage: fileField('Profile image')
});

export default function ShopKeeperForm({
  initialData,
  pageTitle
}: {
  initialData: ShopKeeper | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const defaultValues: z.infer<typeof formSchema> = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    isActive: initialData?.isActive ?? true,
    createdById: initialData?.createdById ?? '',
    createdByType: initialData?.createdByType ?? '',
    createdAt: initialData?.createdAt ?? '',
    updatedAt: initialData?.updatedAt ?? '',
    aadharCardImage: initialData?.aadharCardImage
      ? [initialData.aadharCardImage]
      : [],
    panCardImage: initialData?.panCardImage ? [initialData.panCardImage] : [],
    profileImage: initialData?.profileImage ? [initialData.profileImage] : []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function prepareFormData(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    // Basic fields
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    formData.append('isActive', String(values.isActive));
    // 🖼️ Files — only append if it's actually a File (not a string URL)
    const maybeAppendFile = (fieldName: string, fieldValue?: any[]) => {
      const file = fieldValue?.[0];
      if (file && file instanceof File) {
        formData.append(fieldName, file);
      }
    };

    maybeAppendFile('aadharCardImage', values.aadharCardImage);
    maybeAppendFile('panCardImage', values.panCardImage);
    maybeAppendFile('profileImage', values.profileImage);

    return formData;
  }

  async function handleAddShopKeeper(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/createShopkeeper`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `Failed to create shopkeeper: ${errorData.message || res.statusText}`
        );
        return;
      }

      toast.success('✅ Shopkeeper created successfully!');
      router.push('/dashboard/shopkeeper');
    } catch (err) {
      console.error('Error creating shopkeeper:', err);
      toast.error('Unexpected error while creating shopkeeper');
    }
  }

  async function handleUpdateShopkeeper(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/updateShopkeeper/${values.id}`,
        {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `Failed to update shopkeeper: ${errorData.message || res.statusText}`
        );
        return;
      }

      toast.success('Shopkeeper updated successfully!');
      router.push('/dashboard/shopkeeper');
    } catch (err) {
      console.error('Error updating shopkeeper:', err);
      toast.error('Unexpected error while updating shopkeeper');
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pageTitle === 'Edit ShopKeeper') handleUpdateShopkeeper(values);
    else handleAddShopKeeper(values);
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
            className='space-y-8'
          >
            {pageTitle === 'Edit ShopKeeper' && (
              <div className='mb-10 flex flex-col flex-wrap gap-2 md:flex-row'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>ShopKeeper ID</ItemTitle>
                    <ItemDescription>{initialData?.id}</ItemDescription>
                  </ItemContent>
                </Item>

                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Created By Type</ItemTitle>
                    <ItemDescription>
                      {initialData?.createdByType} <br />{' '}
                      {initialData?.createdById}
                    </ItemDescription>
                  </ItemContent>
                </Item>

                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Created At</ItemTitle>
                    <ItemDescription>
                      {initialData?.createdAt
                        ? formatDate(initialData.createdAt)
                        : '-'}
                    </ItemDescription>
                  </ItemContent>
                </Item>

                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Updated At</ItemTitle>
                    <ItemDescription>
                      {initialData?.updatedAt
                        ? formatDate(initialData.updatedAt)
                        : '-'}
                    </ItemDescription>
                  </ItemContent>
                </Item>

                <Item
                  variant='outline'
                  className='flex items-center justify-between gap-4'
                >
                  <ItemMedia variant='icon'>
                    {form.watch('isActive') ? (
                      <Check color='#00ff00' />
                    ) : (
                      <X color='#ff0000' />
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Active Status</ItemTitle>
                    <ItemDescription>
                      {form.watch('isActive') ? 'Active' : 'Inactive'}
                    </ItemDescription>
                    <FormControl className='mt-2'>
                      <Switch
                        checked={form.watch('isActive')}
                        onCheckedChange={(checked) =>
                          form.setValue('isActive', checked)
                        }
                      />
                    </FormControl>
                  </ItemContent>
                </Item>
              </div>
            )}

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>ShopKeeper Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shopkeeper name'
                    {...form.register('name')}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter mobile number'
                    {...form.register('phone')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter email address'
                    {...form.register('email')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>

              {/* File upload fields */}

              <FormField
                control={form.control}
                name='aadharCardImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Aadhar Card Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.aadharCardImage?.message as string}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='panCardImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Pan Card Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.panCardImage?.message as string}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='profileImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.profileImage?.message as string}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <Button className='cursor-pointer' type='submit'>
              {pageTitle === 'Edit ShopKeeper'
                ? 'Update ShopKeeper'
                : 'Add ShopKeeper'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
