import React, { useState } from 'react'
import { COUNTRIES, IMPACT, TERMS, PRODUCT_CATEGORIES, PRODUCT_QUALITY, SHIPMENT } from '~/constants/constants'
import { Select, SelectItem, Chip, Avatar } from '@nextui-org/react'
import { FileUploader } from 'react-drag-drop-files'

const ModalForm = ({ modalSection, handleChange, handleSubmit }) => {
  // product: '',
  // category: '',
  // quantity: '',
  // description: '',
  // price_usd: '',
  // quality: '',
  // shipment: '',
  // payment_terms: '',
  // hvi: '',
  // agents: ''
  // offered: ''

  const users = [
    {
      id: 1,
      name: 'Tony Reichert',
      role: 'CEO',
      team: 'Management',
      status: 'active',
      age: '29',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png',
      email: 'tony.reichert@example.com'
    },
    {
      id: 2,
      name: 'Zoey Lang',
      role: 'Tech Lead',
      team: 'Development',
      status: 'paused',
      age: '25',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png',
      email: 'zoey.lang@example.com'
    },
    {
      id: 3,
      name: 'Jane Fisher',
      role: 'Sr. Dev',
      team: 'Development',
      status: 'active',
      age: '22',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png',
      email: 'jane.fisher@example.com'
    },
    {
      id: 4,
      name: 'William Howard',
      role: 'C.M.',
      team: 'Marketing',
      status: 'vacation',
      age: '28',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png',
      email: 'william.howard@example.com'
    },
    {
      id: 5,
      name: 'Kristen Copper',
      role: 'S. Manager',
      team: 'Sales',
      status: 'active',
      age: '24',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png',
      email: 'kristen.cooper@example.com'
    },
    {
      id: 6,
      name: 'Brian Kim',
      role: 'P. Manager',
      team: 'Management',
      age: '29',
      avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png',
      email: 'brian.kim@example.com',
      status: 'Active'
    }]

  return (
    <>
      {modalSection === 'Recent Events' && (
        <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSubmit}>
          <div className='flex gap-4'>
            <Select
              radius='md'
              label='Select the impact'
              classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
              className='mb-4'
              size='md'
              name='impact'
              onChange={handleChange}
              placeholder='Select the impact'
              variant='bordered'
              labelPlacement='outside'
            >
              {IMPACT.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='mb-4'>
            <label
              htmlFor='image'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Image (optional)
            </label>
            <input
              type='text'
              name='image'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter a url to an image e.g. https://picsum.photos/200'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Title
            </label>
            <input
              type='text'
              name='title'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter title'
            />
          </div>
          <div>
            <label
              htmlFor='text'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Text
            </label>
            <textarea placeholder='Enter text' name='text' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>
        </form>
      )}

      {modalSection === 'Future Considerations' && (
        <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSubmit}>
          <div className='flex gap-4'>
            <Select
              radius='md'
              label='Select the impact'
              classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
              className='mb-4'
              size='md'
              name='impact'
              onChange={handleChange}
              placeholder='Select the impact'
              variant='bordered'
              labelPlacement='outside'
            >
              {IMPACT.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              radius='md'
              label='Select the term'
              classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
              className='mb-4'
              size='md'
              name='news_type'
              onChange={handleChange}
              placeholder='Future long/short term consideration'
              variant='bordered'
              labelPlacement='outside'
            >
              {TERMS.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.parameter}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className='mb-4'>
            <label
              htmlFor='image'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Image (optional)
            </label>
            <input
              type='text'
              name='image'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter a url to an image e.g. https://picsum.photos/200'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Title
            </label>
            <input
              type='text'
              name='title'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter title'
            />
          </div>
          <div>
            <label
              htmlFor='text'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Text
            </label>
            <textarea placeholder='Enter text' name='text' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

        </form>
      )}

      {modalSection === 'In Country News' && (
        <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSubmit}>
          <div className='flex gap-4'>
            <Select
              radius='md'
              label='Select the impact'
              classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
              className='mb-4'
              size='md'
              name='impact'
              onChange={handleChange}
              placeholder='Select the impact'
              variant='bordered'
              labelPlacement='outside'
            >
              {IMPACT.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Select
            radius='md'
            label='Select a Country'
            classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
            className='mb-4'
            size='md'
            name='country'
            onChange={handleChange}
            placeholder='Select the country'
            variant='bordered'
            labelPlacement='outside'
          >
            {COUNTRIES.map((option) => (
              <SelectItem key={option.country} value={option.country}>
                {option.country}
              </SelectItem>
            ))}
          </Select>
          <div className='mb-4'>
            <label
              htmlFor='image'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Image (optional)
            </label>
            <input
              type='text'
              name='image'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter a url to an image e.g. https://picsum.photos/200'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Title
            </label>
            <input
              type='text'
              name='title'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter title'
            />
          </div>
          <div>
            <label
              htmlFor='text'
              className='block text-gray-700 text-sm font-bold mb-2 pl-3'
            >
              Text
            </label>
            <textarea placeholder='Enter text' name='text' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

        </form>
      )}

      {modalSection === 'Add Product' && (
        <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSubmit}>
          <div className='flex gap-4 mb-4'>
            <div className='w-[50%]'>
              <label
                htmlFor='product'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Product name
              </label>
              <input
                type='text'
                name='product'
                onChange={handleChange}
                className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                placeholder='Enter the product name'
              />
            </div>
            <div className='w-[50%]'>
              <Select
                radius='md'
                label='Category'
                classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                size='md'
                name='category'
                onChange={handleChange}
                placeholder='Select the category'
                variant='bordered'
                labelPlacement='outside'
              >
                {PRODUCT_CATEGORIES.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          {/* <div className='mb-4'>
            <label
              htmlFor='image'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Image (optional)
            </label>
            <input
              type='text'
              name='image'
              onChange={handleChange}
              className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
              placeholder='Enter a url to an image e.g. https://picsum.photos/200'
            />
          </div> */}

          <div className='mb-2'>
            <label htmlFor='description' className='block text-gray-700 text-sm font-bold mb-2'>
              Product Description
            </label>
            <textarea placeholder='Enter product description' name='description' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

          <div className='flex gap-4 mb-4'>
            <div className='w-[50%]'>
              <label htmlFor='price_usd' className='block text-gray-700 text-sm font-bold mb-2'>
                Price in USD
              </label>
              <input
                type='number'
                name='price_usd'
                onChange={handleChange}
                className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                placeholder='Enter the product Price'
              />
            </div>
            <div className='w-[50%]'>
              <label htmlFor='quantity' className='block text-gray-700 text-sm font-bold mb-2'>
                Quantity
              </label>
              <input
                type='number'
                name='quantity'
                onChange={handleChange}
                className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                placeholder='Enter the product quantity'
              />
            </div>
          </div>

          <div className='flex gap-4 mb-4'>
            <div className='w-[50%]'>
              <Select
                radius='md'
                label='Quality'
                classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                size='md'
                name='quality'
                onChange={handleChange}
                placeholder='Select the quality'
                variant='bordered'
                labelPlacement='outside'
              >
                {PRODUCT_QUALITY.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className='w-[50%]'>
              <Select
                radius='md'
                label='Shipment'
                classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                size='md'
                name='shipment'
                onChange={handleChange}
                placeholder='Select the shipment'
                variant='bordered'
                labelPlacement='outside'
              >
                {SHIPMENT.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className='mb-2'>
            <label htmlFor='payment_terms' className='block text-gray-700 text-sm font-bold mb-2'>
              Payment Terms
            </label>
            <textarea placeholder='Enter product description' name='payment_terms' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

          <label
            htmlFor='hvi_file'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            HVI File
          </label>

          <FileUploader classes='!border-dotted !border-gray-300 !p-14 !w-full !max-w-full !mb-4' label='Drop here your HVI file' className='bg-red-400' handleChange={handleChange} name='hvi_file' types={['PDF']} />

          <div className='flex gap-4'>

            <Select
              items={users}
              label='[NOT AVAILABLE YET] Agent assignment'
              variant='bordered'
              isMultiline
              selectionMode='multiple'
              placeholder='Select agent/agents'
              labelPlacement='outside'
              classNames={{
                label: 'font-bold',
                base: 'w-[50%]',
                trigger: 'min-h-unit-12 py-2 rounded-md border border-gray-300'
              }}
              renderValue={(items) => {
                return (
                  <div className='flex flex-wrap gap-2'>
                    {items.map((item) => (
                      <Chip key={item.key}>{item.data.name}</Chip>
                    ))}
                  </div>
                )
              }}
            >
              {(user) => (
                <SelectItem key={user.id} textValue={user.name}>
                  <div className='flex gap-2 items-center'>
                    <Avatar alt={user.name} className='flex-shrink-0' size='sm' src={user.avatar} />
                    <div className='flex flex-col'>
                      <span className='text-small'>{user.name}</span>
                      <span className='text-tiny text-default-400'>{user.email}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            <label
              htmlFor='offer'
              className='block text-gray-700 text-sm font-bold mb-2'
            />
            <Select
              label=' [NOT AVAILABLE YET] Offer to:'
              radius='md'
              classNames={{ label: 'font-bold', base: 'w-[50%]', trigger: 'rounded-md border border-gray-300' }}
              size='md'
              name='shipment'
              onChange={handleChange}
              placeholder='Select your client list'
              variant='bordered'
              labelPlacement='outside'
            >
              {SHIPMENT.map((option) => (
                <SelectItem key={option.parameter} value={option.parameter}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </form>
      )}
    </>

  )
}

export default ModalForm
