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
import { Shop } from '@/constants/data';
import { formatDate } from '@/lib/format';
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
  name: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  pin: z.string().length(6).regex(/^\d+$/),
  geoPoint: z.object({ lat: z.number(), long: z.number() }),
  gstin: z.string().min(15),
  panNo: z.string().length(10),
  isActive: z.boolean(),

  agreementImage: fileField('Agreement image'),
  gstCertificateImage: fileField('GST image'),
  shopPanCardImage: fileField('Shop PAN'),
  aadharCardImage: fileField('Aadhar')
});

/* ---------- COMPONENT ---------- */

export default function ShopForm({
  initialData,
  pageTitle
}: {
  initialData: Shop | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const [shopkeepers, setShopkeepers] = useState<any[]>([]);
  const [selectedShopkeepers, setSelectedShopkeepers] = useState<string[]>([]);

  const [isShopkeeperDropdownOpen, setIsShopkeeperDropdownOpen] =
    useState(false);
  const [shopkeeperSearch, setShopkeeperSearch] = useState('');

  const defaultValues: z.infer<typeof formSchema> = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    district: initialData?.district ?? '',
    state: initialData?.state ?? '',
    pin: initialData?.pin ?? '',
    geoPoint: initialData?.geoPoint ?? { lat: 0, long: 0 },
    gstin: initialData?.gstin ?? '',
    panNo: initialData?.panNo ?? '',
    isActive: initialData?.isActive ?? true,

    agreementImage: initialData?.agreementImage
      ? [initialData.agreementImage]
      : [],
    gstCertificateImage: initialData?.gstCertificateImage
      ? [initialData.gstCertificateImage]
      : [],
    shopPanCardImage: initialData?.shopPanCardImage
      ? [initialData.shopPanCardImage]
      : [],
    aadharCardImage: initialData?.aadharCardImage
      ? [initialData.aadharCardImage]
      : []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  /* ---------- LOAD ALL SHOPKEEPERS ---------- */

  useEffect(() => {
    const loadShopkeepers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shops/getShopkeepers`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setShopkeepers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadShopkeepers();
  }, []);

  /* ---------- LOAD ASSIGNED SHOPKEEPERS (EDIT MODE) ---------- */

  useEffect(() => {
    if (!initialData?.id) return;

    const loadAssigned = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shops/${initialData.id}/assigned-shopkeepers`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setSelectedShopkeepers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAssigned();
  }, [initialData]);

  /* ---------- FORMDATA ---------- */

  async function prepareFormData(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('district', values.district);
    formData.append('state', values.state);
    formData.append('pin', values.pin);
    formData.append('gstin', values.gstin);
    formData.append('panNo', values.panNo);
    formData.append('isActive', String(values.isActive));
    formData.append('geoPoint', JSON.stringify(values.geoPoint));

    const addFile = (name: string, val?: any[]) => {
      const f = val?.[0];
      if (f && f instanceof File) formData.append(name, f);
    };

    addFile('agreementImage', values.agreementImage);
    addFile('gstCertificateImage', values.gstCertificateImage);
    addFile('shopPanCardImage', values.shopPanCardImage);
    addFile('aadharCardImage', values.aadharCardImage);

    return formData;
  }

  /* ---------- SYNC ASSIGNMENTS ---------- */

  async function syncAssignments(shopId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/shops/${shopId}/sync-shopkeepers`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopkeeperIds: selectedShopkeepers })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to sync shopkeepers');
    }
  }

  /* ---------- CREATE ---------- */

  async function handleAddShop(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/createShop`,
        { method: 'POST', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Create failed');
        return;
      }
      const data = await res.json();
      await syncAssignments(data.shopId);
      console.log('After shopkeeper data sync');

      toast.success('Shop created successfully');
      router.push('/dashboard/shop');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  /* ---------- UPDATE ---------- */

  async function handleUpdateShop(values: z.infer<typeof formSchema>) {
    try {
      const formData = await prepareFormData(values);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shops/updateShop/${values.id}`,
        { method: 'PUT', body: formData, credentials: 'include' }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || 'Update failed');
        return;
      }

      await syncAssignments(values.id!);

      toast.success('Shop updated successfully');
      router.push('/dashboard/shop');
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (pageTitle === 'Edit Shop') handleUpdateShop(values);
    else handleAddShop(values);
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
            {pageTitle === 'Edit Shop' && (
              <div className='mb-10 flex flex-col flex-wrap gap-2 md:flex-row'>
                <Item variant='outline'>
                  <ItemContent>
                    <ItemTitle>Shop ID</ItemTitle>
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
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shop name'
                    {...form.register('name')}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Shop District</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shop district'
                    {...form.register('district')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.district?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Shop State</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shop state'
                    {...form.register('state')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.state?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Shop Pin</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter shop pin'
                    {...form.register('pin')}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.pin?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>GSTIN</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter GSTIN'
                    {...form.register('gstin')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.gstin?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter PAN number'
                    {...form.register('panNo')}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.panNo?.message}
                </FormMessage>
              </FormItem>

              {/* File upload fields */}
              <FormField
                control={form.control}
                name='agreementImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Agreement Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.agreementImage?.message as string}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gstCertificateImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>GST Certificate Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {
                        form.formState.errors.gstCertificateImage
                          ?.message as string
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='shopPanCardImage'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Shop PAN Card Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage>
                      {
                        form.formState.errors.shopPanCardImage
                          ?.message as string
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />

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

              <div className='mt-4 md:col-span-2'>
                <h3 className='mb-2 font-semibold'>GeoPoint</h3>
              </div>

              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='any'
                    placeholder='Enter latitude'
                    {...form.register('geoPoint.lat', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.geoPoint?.lat?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='any'
                    placeholder='Enter longitude'
                    {...form.register('geoPoint.long', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.geoPoint?.long?.message}
                </FormMessage>
              </FormItem>
            </div>

            {/* ✅ ASSIGNMENT UI */}
            <div className='mt-8 md:col-span-2'>
              <h3 className='mb-2 font-semibold'>Assign Shopkeepers</h3>

              <div className='relative w-full max-w-md'>
                {/* Button */}
                <button
                  type='button'
                  className='flex w-full items-center justify-between rounded border px-3 py-2 text-sm'
                  onClick={() => setIsShopkeeperDropdownOpen((o) => !o)}
                >
                  <span className='truncate'>
                    {selectedShopkeepers.length === 0
                      ? 'Select shopkeepers'
                      : `${selectedShopkeepers.length} selected`}
                  </span>
                  <span className='cursor-pointer text-xs'>▼</span>
                </button>

                {/* Dropdown */}
                {isShopkeeperDropdownOpen && (
                  <div className='absolute z-20 mt-1 w-full rounded border bg-black shadow-md'>
                    {/* Search input */}
                    <input
                      type='text'
                      placeholder='Search by name…'
                      className='w-full border-b px-3 py-2 text-sm outline-none'
                      value={shopkeeperSearch}
                      onChange={(e) => setShopkeeperSearch(e.target.value)}
                    />

                    {/* List */}
                    <div className='max-h-64 overflow-y-auto'>
                      {shopkeepers
                        .filter((sk) =>
                          sk.name
                            ?.toLowerCase()
                            .includes(shopkeeperSearch.toLowerCase())
                        )
                        .map((sk) => (
                          <label
                            key={sk.id}
                            className='flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700'
                          >
                            <input
                              type='checkbox'
                              checked={selectedShopkeepers.includes(sk.id)}
                              onChange={() =>
                                setSelectedShopkeepers((prev) =>
                                  prev.includes(sk.id)
                                    ? prev.filter((id) => id !== sk.id)
                                    : [...prev, sk.id]
                                )
                              }
                            />
                            <span>{sk.name}</span>
                          </label>
                        ))}

                      {shopkeepers.length > 0 &&
                        shopkeepers.filter((sk) =>
                          sk.name
                            ?.toLowerCase()
                            .includes(shopkeeperSearch.toLowerCase())
                        ).length === 0 && (
                          <p className='px-3 py-2 text-sm text-gray-400'>
                            No matching shopkeepers
                          </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className='cursor-pointer border-t px-3 py-2 text-right'>
                      <button
                        type='button'
                        className='text-xs text-amber-500 hover:underline'
                        onClick={() => setIsShopkeeperDropdownOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button className='cursor-pointer' type='submit'>
              {pageTitle === 'Edit Shop' ? 'Update Shop' : 'Add Shop'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
