/* eslint-disable no-console */
'use client';

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
  ItemTitle
} from '@/components/ui/item';
import { Product } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// ✅ PRODUCT VALIDATION SCHEMA (NO IMAGE)
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  hsnCode: z.string().min(1, 'HSN Code is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().min(1, 'Subcategory is required')
});

export default function ProductForm({
  initialData,
  pageTitle
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // Load categories + subcategories
  useEffect(() => {
    const loadAll = async () => {
      try {
        const cRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getCategories`,
          { credentials: 'include' }
        );
        const sRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/getSubCategories`,
          { credentials: 'include' }
        );

        const cData = await cRes.json();
        const sData = await sRes.json();

        setCategories(cData.data || cData);
        setSubCategories(sData.data || sData);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories or subcategories');
      }
    };

    loadAll();
  }, []);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: initialData?.id ?? '',
      name: initialData?.name ?? '',
      hsnCode: initialData?.hsnCode ?? '',
      summary: initialData?.summary ?? '',
      description: initialData?.description ?? '',
      categoryId: initialData?.categoryId ?? '',
      subcategoryId: initialData?.subcategoryId ?? ''
    }
  });

  const filteredSubCategories = subCategories.filter(
    (sc) => sc.categoryId === form.watch('categoryId')
  );

  async function prepareFormData(values: z.infer<typeof productSchema>) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('hsnCode', values.hsnCode);
    formData.append('summary', values.summary);
    formData.append('description', values.description);
    formData.append('categoryId', values.categoryId);
    formData.append('subcategoryId', values.subcategoryId);
    return formData;
  }

  // Create Product
  async function handleAdd(values: z.infer<typeof productSchema>) {
    const fd = await prepareFormData(values);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/createProduct`,
        { method: 'POST', body: fd, credentials: 'include' }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product created successfully!');
      router.push('/dashboard/product');
    } catch (err) {
      console.error(err);
      toast.error('Error creating product');
    }
  }

  // Update Product
  async function handleUpdate(values: z.infer<typeof productSchema>) {
    const fd = await prepareFormData(values);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/updateProduct/${values.id}`,
        { method: 'PUT', body: fd, credentials: 'include' }
      );

      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('Product updated successfully!');
      router.push('/dashboard/product');
    } catch (err) {
      console.error(err);
      toast.error('Error updating product');
    }
  }

  function onSubmit(values: z.infer<typeof productSchema>) {
    pageTitle === 'Edit Product' ? handleUpdate(values) : handleAdd(values);
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
            {pageTitle === 'Edit Product' && (
              <div className='mb-8 flex flex-wrap gap-4'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Product ID</ItemTitle>
                    <ItemDescription>{initialData?.id}</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            )}

            {/* FORM FIELDS */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter product name'
                    {...form.register('name')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>HSN Code</FormLabel>
                <FormControl>
                  <Input placeholder='HSN Code' {...form.register('hsnCode')} />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Short summary'
                    {...form.register('summary')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Full description'
                    {...form.register('description')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* CATEGORY DROPDOWN */}
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className='rounded-md border p-2'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue('subcategoryId', '');
                        }}
                      >
                        <option value=''>Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBCATEGORY DROPDOWN */}
              <FormField
                control={form.control}
                name='subcategoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <select
                        className='rounded-md border p-2'
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value=''>Select Subcategory</option>
                        {filteredSubCategories.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='cursor-pointer'>
              {pageTitle === 'Edit Product'
                ? 'Update Product'
                : 'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
