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
import { Category } from '@/constants/data';
import { formatDate } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// 🧩 Image validator
const fileField = (fieldName: string) =>
  z.any().refine(
    (files) => {
      if (typeof files === 'string') return true;
      if (Array.isArray(files) && typeof files[0] === 'string') return true;
      if (!files || files.length === 0) return false;

      const file = files[0];
      if (!(file instanceof File)) return false;

      return (
        file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    },
    {
      message: `${fieldName} must be a valid image (jpg, jpeg, png, webp) under 5MB`
    }
  );

// ✅ CATEGORY VALIDATION SCHEMA
export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  summary: z
    .string()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary must be at most 500 characters'),
  isActive: z.boolean(),
  thumbnailImage: fileField('Thumbnail image')
});

export default function CategoryForm({
  initialData,
  pageTitle
}: {
  initialData: Category | null;
  pageTitle: string;
}) {
  const router = useRouter();

  // ✅ DEFAULT VALUES ONLY FROM SCHEMA
  const defaultValues: z.infer<typeof formSchema> = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    summary: initialData?.summary ?? '',
    isActive: initialData?.isActive ?? true,
    thumbnailImage: initialData?.thumbnailImage
      ? [initialData.thumbnailImage]
      : []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function prepareFormData(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('summary', values.summary);
    formData.append('isActive', String(values.isActive));

    const file = values.thumbnailImage?.[0];
    if (file instanceof File) {
      formData.append('thumbnailImage', file);
    }

    return formData;
  }

  // ✅ CREATE CATEGORY
  async function handleAddCategory(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/createCategory`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to create category');
        return;
      }

      toast.success('Category created successfully!');
      router.push('/dashboard/category');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error while creating category');
    }
  }

  // ✅ UPDATE CATEGORY
  async function handleUpdateCategory(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/updateCategory/${values.id}`,
        {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to update category');
        return;
      }

      toast.success('Category updated successfully!');
      router.push('/dashboard/category');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error while updating category');
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pageTitle === 'Edit Category') handleUpdateCategory(values);
    else handleAddCategory(values);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* ✅ EDIT INFO PANEL */}
            {pageTitle === 'Edit Category' && (
              <div className='mb-8 flex flex-wrap gap-4'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Category ID</ItemTitle>
                    <ItemDescription>{initialData?.id}</ItemDescription>
                  </ItemContent>
                </Item>

                <Item variant='outline' className='flex items-center gap-4'>
                  <ItemMedia variant='icon'>
                    {form.watch('isActive') ? (
                      <Check color='green' />
                    ) : (
                      <X color='red' />
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Status</ItemTitle>
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

            {/* ✅ FORM FIELDS */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter category name'
                    {...form.register('name')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Short category description'
                    {...form.register('summary')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* ✅ THUMBNAIL */}
              <FormField
                control={form.control}
                name='thumbnailImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        maxFiles={1}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='cursor-pointer'>
              {pageTitle === 'Edit Category'
                ? 'Update Category'
                : 'Create Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
