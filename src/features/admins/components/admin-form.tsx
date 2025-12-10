/* eslint-disable no-console */
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
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
import { Switch } from '@/components/ui/switch'; // Toggle switch
import { Admin } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// ✅ Schema
const formSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phoneNumber: z
    .string()
    .length(10, { message: 'Phone number must be exactly 10 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
  isActive: z.boolean(),
  createdBy: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
});

export default function AdminForm({
  initialData,
  pageTitle
}: {
  initialData: Admin | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const defaultValues: z.infer<typeof formSchema> = {
    id: initialData?.id ?? '',
    email: initialData?.email ?? '',
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    phoneNumber: initialData?.phoneNumber ?? '',
    isActive: initialData?.isActive ?? true,
    createdBy: initialData?.createdBy ?? '',
    password: '' // always start empty
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // ✅ Add admin
  async function handleAddAdmin(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superadmins/admin/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(values)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `Failed to create admin: ${errorData.message || res.statusText}`
        );
        return;
      }

      toast.success('✅ Admin created successfully!');
      router.push('/dashboard/admin');
    } catch (err) {
      console.error('Error creating admin:', err);
      toast.error('Unexpected error while creating admin');
    }
  }

  // ✅ Update admin
  async function handleUpdateAdmin(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/superadmins/admin/update/${values.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(values)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          `Failed to update admin: ${errorData.message || res.statusText}`
        );
        return;
      }

      toast.success('Admin updated successfully!');
      router.push('/dashboard/admin');
    } catch (err) {
      console.error('Error updating admin:', err);
      toast.error('Unexpected error while updating admin');
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pageTitle === 'Edit Admin') {
      handleUpdateAdmin(values);
    } else {
      handleAddAdmin(values);
    }
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
            {/* Edit Admin info section */}
            {pageTitle === 'Edit Admin' && (
              <div className='mb-10 flex flex-col gap-6 md:flex-row'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Admin ID</ItemTitle>
                    <ItemDescription>{initialData?.id}</ItemDescription>
                  </ItemContent>
                </Item>

                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Created By</ItemTitle>
                    <ItemDescription>{initialData?.createdBy}</ItemDescription>
                  </ItemContent>
                </Item>

                {/* ✅ Active Status with toggle */}
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

            {/* Input fields */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>Admin First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter admin first name'
                    {...form.register('firstName')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.firstName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Admin Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter admin last name'
                    {...form.register('lastName')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.lastName?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter admin email'
                    {...form.register('email')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Admin Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter admin phone number'
                    {...form.register('phoneNumber')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phoneNumber?.message}
                </FormMessage>
              </FormItem>

              <FormItem className='md:col-span-2'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...form.register('password')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            </div>

            <Button type='submit' className='cursor-pointer'>
              {pageTitle === 'Edit Admin' ? 'Update Admin' : 'Add Admin'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
