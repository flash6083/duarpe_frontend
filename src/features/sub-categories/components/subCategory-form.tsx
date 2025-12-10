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
import { subCategory, Category } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

/* ---------- ZOD ---------- */

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

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
    { message: `${fieldName} must be a valid image under 5MB` }
  );

export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Sub-category name required'),
  description: z.string().min(10, 'Minimum 10 characters'),
  isActive: z.boolean(),
  categoryId: z.string().min(1, 'Category is required'),
  thumbnailImage: fileField('Thumbnail image')
});

/* ---------- COMPONENT ---------- */

export default function SubCategoryForm({
  initialData,
  pageTitle
}: {
  initialData: subCategory | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const defaultValues: z.infer<typeof formSchema> = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    isActive: initialData?.isActive ?? true,
    categoryId: initialData?.categoryId ?? '',
    thumbnailImage: initialData?.thumbnailImage
      ? [initialData.thumbnailImage]
      : []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  /* ---------- LOAD CATEGORIES ---------- */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getCategories`,
          { credentials: 'include' }
        );

        const data = await res.json();
        setCategories(data.data || data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  /* ---------- FORMDATA ---------- */

  async function prepareFormData(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('categoryId', values.categoryId);
    formData.append('isActive', String(values.isActive));

    const file = values.thumbnailImage?.[0];
    if (file instanceof File) formData.append('thumbnailImage', file);

    return formData;
  }

  /* ---------- CREATE ---------- */

  async function handleAdd(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/createSubCategory`,
        { method: 'POST', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Sub-category creation failed');
        return;
      }

      toast.success('Sub-category created');
      router.push('/dashboard/subCategory');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  /* ---------- UPDATE ---------- */

  async function handleUpdate(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/updateSubCategory/${values.id}`,
        { method: 'PUT', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Sub-category updation failed');
        return;
      }

      toast.success('Sub-category updated');
      router.push('/dashboard/subCategory');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pageTitle === 'Edit sub-category') handleUpdate(values);
    else handleAdd(values);
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
            {/* ---------- EDIT PANEL ---------- */}
            {pageTitle === 'Edit sub-category' && (
              <div className='mb-8 flex flex-wrap gap-4'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>ID</ItemTitle>
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

            {/* ---------- FIELDS ---------- */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>Sub-Category Name</FormLabel>
                <FormControl>
                  <Input {...form.register('name')} />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                name='categoryId'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <FormControl>
                      <select
                        className='w-full rounded border p-2'
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value=''>Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='md:col-span-2'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...form.register('description')} />
                </FormControl>
                <FormMessage />
              </FormItem>

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
              {pageTitle === 'Edit sub-category'
                ? 'Update sub-category'
                : 'Create sub-category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
