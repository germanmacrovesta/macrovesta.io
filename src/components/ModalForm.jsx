import React from 'react'
import { COUNTRIES, IMPACT, TERMS, PRODUCTS_CATEGORIES } from '~/constants/constants'
import { Select, SelectItem } from '@nextui-org/react'

const ModalForm = ({ modalSection, handleChange, handleSubmit }) => {
  // product: '',
  // category: '',
  // quantity: '',
  // description: '',
  // price_usd: '',
  // quality: '',
  // shipment: '',
  // payment_terms: ''
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
          <div className='flex gap-4'>
            <div className='mb-4 w-[50%]'>
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
            <div className='flex gap-4 w-[50%]'>
              <Select
                radius='md'
                label='Select the category'
                classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                size='md'
                name='category'
                onChange={handleChange}
                placeholder='Select the category'
                variant='bordered'
                labelPlacement='outside'
              >
                {PRODUCTS_CATEGORIES.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <div className='mb-4'>
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
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Product Description
            </label>
            <textarea placeholder='Enter product description' name='description' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>
          <label
            htmlFor='cents_per_pound3'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Price in USD
          </label>
          <input
            type='text'
            id='price'
            required
            className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
            placeholder='Enter the product Price'
          />
        </form>
      )}
    </>

  )
}

export default ModalForm
