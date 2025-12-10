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
  ItemTitle
} from '@/components/ui/item';
import { Variant } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
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

const fileValidator = (label: string) =>
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
    { message: `${label} must be a valid image under 5MB` }
  );

const multipleFilesValidator = (label: string) =>
  z.any().refine(
    (files) => {
      if (!files) return false;
      if (Array.isArray(files) && files.every((f) => typeof f === 'string'))
        return true;

      if (!Array.isArray(files)) return false;
      if (files.length === 0 || files.length > 10) return false;

      return files.every(
        (file: any) =>
          file instanceof File &&
          file.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    },
    { message: `${label} must contain valid images (max 10)` }
  );

export const variantSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  details: z.string().min(5, 'Minimum 5 characters'),

  unitType: z.enum(['kg', 'g', 'l', 'ml', 'pcs']),
  unit: z.number(),

  mrp: z.number(),
  gstPercent: z.number().min(0),
  discountedPrice: z.number().min(0),

  thumbnailImage: fileValidator('Thumbnail image'),
  images: multipleFilesValidator('Variant images'),

  fssaiLicense: z.string().optional(),
  shelfLife: z.string().optional(),
  countryOfOrigin: z.string().optional()
});

/* ---------- COMPONENT ---------- */

export default function VariantForm({
  initialData,
  pageTitle
}: {
  initialData: Variant | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [productList, setProductList] = useState<any[]>([]);

  const defaultValues: z.infer<typeof variantSchema> = {
    id: initialData?.id ?? '',
    productId: initialData?.productId ?? '',
    details: initialData?.details ?? '',
    unitType: initialData?.unitType ?? 'pcs',
    unit: initialData?.unit ?? 1,
    mrp: initialData?.mrp ?? 0,
    gstPercent: initialData?.gstPercent ?? 0,
    discountedPrice: initialData?.discountedPrice ?? 0,
    thumbnailImage: initialData?.thumbnailImage
      ? [initialData.thumbnailImage]
      : [],
    images: initialData?.images ?? [],
    fssaiLicense: initialData?.fssaiLicense ?? '',
    shelfLife: initialData?.shelfLife ?? '',
    countryOfOrigin: initialData?.countryOfOrigin ?? ''
  };

  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues
  });

  /* ---------- LOAD VARIANTS ---------- */

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/getProducts`,
          {
            credentials: 'include'
          }
        );

        const data = await res.json();
        setProductList(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      }
    };

    loadVariants();
  }, []);

  /* ---------- PREPARE FORMDATA ---------- */

  async function prepareFormData(values: z.infer<typeof variantSchema>) {
    const formData = new FormData();

    formData.append('productId', values.productId);
    formData.append('details', values.details);
    formData.append('unitType', values.unitType);
    formData.append('unit', String(values.unit));
    formData.append('mrp', String(values.mrp));
    formData.append('gstPercent', String(values.gstPercent));
    formData.append('discountedPrice', String(values.discountedPrice));

    formData.append('fssaiLicense', values.fssaiLicense || '');
    formData.append('shelfLife', values.shelfLife || '');
    formData.append('countryOfOrigin', values.countryOfOrigin || '');

    if (values.thumbnailImage?.[0] instanceof File)
      formData.append('thumbnailImage', values.thumbnailImage[0]);

    if (Array.isArray(values.images)) {
      values.images.forEach((file) => {
        if (file instanceof File) formData.append('images', file);
      });
    }

    return formData;
  }

  /* ---------- CREATE ---------- */

  async function handleAdd(values: z.infer<typeof variantSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/createVariant`,
        { method: 'POST', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Variant creation failed');
        return;
      }

      toast.success('Variant created successfully');
      router.push('/dashboard/variant');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  /* ---------- UPDATE ---------- */

  async function handleUpdate(values: z.infer<typeof variantSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/updateVariant/${values.id}`,
        { method: 'PUT', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Variant updation failed');
        return;
      }

      toast.success('Variant updated successfully');
      router.push('/dashboard/variant');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  function onSubmit(values: z.infer<typeof variantSchema>) {
    if (pageTitle === 'Edit variant') handleUpdate(values);
    else handleAdd(values);
  }

  /* ---------- RENDER ---------- */

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
            {pageTitle === 'Edit variant' && (
              <div className='mb-8 flex flex-wrap gap-4'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>ID</ItemTitle>
                    <ItemDescription>{initialData?.id}</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            )}

            {/* ---------- FIELDS ---------- */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* PRODUCT */}
              <FormField
                name='productId'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <select
                        className='w-full rounded border p-2'
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value=''>Select Product</option>
                        {productList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DETAILS */}
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Input {...form.register('details')} />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* UNIT TYPE */}
              <FormField
                name='unitType'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Type</FormLabel>
                    <FormControl>
                      <select
                        className='w-full rounded border p-2'
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value='kg'>kg</option>
                        <option value='g'>g</option>
                        <option value='l'>l</option>
                        <option value='ml'>ml</option>
                        <option value='pcs'>pcs</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UNIT */}
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...form.register('unit', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* MRP */}
              <FormItem>
                <FormLabel>MRP</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...form.register('mrp', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* GST */}
              <FormItem>
                <FormLabel>GST (%)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...form.register('gstPercent', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* DISCOUNTED PRICE */}
              <FormItem>
                <FormLabel>Discounted Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    {...form.register('discountedPrice', {
                      valueAsNumber: true
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* OPTIONAL FIELDS */}
              <FormItem className='md:col-span-2'>
                <FormLabel>FSSAI License</FormLabel>
                <FormControl>
                  <Input {...form.register('fssaiLicense')} />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Shelf Life (days)</FormLabel>
                <FormControl>
                  <Input {...form.register('shelfLife')} />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <FormControl>
                  <Input {...form.register('countryOfOrigin')} />
                </FormControl>
              </FormItem>

              {/* THUMBNAIL */}
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

              {/* IMAGES */}
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Variant Images (max 10)</FormLabel>
                    <FormControl>
                      <FileUploader
                        maxFiles={10}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Button type='submit' className='cursor-pointer'>
              {pageTitle === 'Edit variant'
                ? 'Update variant'
                : 'Create variant'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
