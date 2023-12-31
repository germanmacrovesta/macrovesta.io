import { useEffect, useState } from 'react'
import { COUNTRIES, IMPACT, TERMS, PRODUCT_CATEGORIES } from '~/constants/constants'
import { Select, SelectItem, Chip, Avatar } from '@nextui-org/react'
import { FileUploader } from 'react-drag-drop-files'
import Spinner from './Spinner'

const ModalForm = ({ modalSection, handleChange, handleSubmit, objectToValidate = {} }) => {
  // Add Product/Edit Product Needs to fetch agents and buyers for selector
  const [agents, setAgents] = useState([])
  const [buyers, setBuyers] = useState([])

  const [client, setClient] = useState(null)
  const [removeClient, setRemoveClient] = useState(false)

  const [loading, setLoading] = useState(true)
  console.log(objectToValidate)

  useEffect(() => {
    if (modalSection !== 'Edit Product') {
      setLoading(false)
      return
    }

    if (Object.keys(objectToValidate).length > 0) {
      setLoading(false)
      setClient(objectToValidate.reserved_by)
      console.log(objectToValidate)
    }
  }, [objectToValidate])

  useEffect(() => {
    if (removeClient && modalSection === 'Edit Product') {
      objectToValidate.reserved_by = null
    } else if (!removeClient && modalSection === 'Edit Product') {
      objectToValidate.reserved_by = client
    }
  }, [removeClient])

  useEffect(() => {
    async function getAgents () {
      try {
        const response = await fetch('/api/get-agents')
        console.log(response)
        const agents = await response.json()
        console.log(agents)
        setAgents(agents)
      } catch (error) {
        // Manejar errores de red u otros errores
        console.error('Error:', error)
      }
    }

    async function getBuyers () {
      try {
        const response = await fetch('/api/get-buyers')
        console.log(response)
        const buyers = await response.json()
        console.log(buyers)
        setBuyers(buyers)
      } catch (error) {
        // Manejar errores de red u otros errores
        console.error('Error:', error)
      }
    }

    if (modalSection === 'Add Product' || modalSection === 'Edit Product') {
      getBuyers()
      getAgents()
    }
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center'>
        <Spinner />
      </div>
    )
  }

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
          <div className='flex gap-4 mb-4'>
            <Select
              radius='md'
              label='Select the impact'
              classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
              className='w-[50%]'
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
              className='w-[50%]'
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

      {(modalSection === 'Add Product' || (modalSection === 'Edit Product')) && (
        <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSubmit}>
          <div className='flex gap-4 mb-4'>
            <div className='w-[50%]'>
              <label
                htmlFor='expiry_date'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Select an Expiry Date
              </label>
              <input
                type='date'
                name='expiry_date'
                value={objectToValidate.expiry_date}
                min='2023-11-07'
                onChange={handleChange}
                className='rounded-md border p-2 mb-2 w-full'
              />
            </div>
            {/* Only when editing - Show Client if someone has reserved */}
            {(modalSection === 'Edit Product' && objectToValidate?.reserved_by_user?.image) && (
              <div className='flex flex-col w-[50%]'>
                <>
                  <label
                    className='block text-gray-700 text-sm font-bold mb-2'
                  >
                    Reserved by:
                  </label>
                  <div className='flex gap-4 justify-between items-center'>
                    {!removeClient
                      ? (
                        <div className='flex gap-2'>
                          <Avatar alt='A' name='A' className='' size='md' src={objectToValidate.reserved_by_user.image} />
                          <div className='flex flex-col'>
                            <span className='text-small'>{objectToValidate.reserved_by_user.name}</span>
                            <span className='text-tiny text-default-400'>{objectToValidate.reserved_by_user.email}</span>
                          </div>
                        </div>
                        )
                      : (
                        <p className='mx-auto'>Client removed, submit to save changes</p>
                        )}

                    <button type='button' className='outline-none text-lg text-default-400 cursor-pointer active:opacity-50' onClick={() => setRemoveClient(!removeClient)}>
                      {!removeClient
                        ? (
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                          </svg>
                          )
                        : (
                          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' />
                          </svg>
                          )}
                    </button>
                  </div>
                </>
              </div>
            )}
          </div>

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
                value={objectToValidate.product}
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
                defaultSelectedKeys={objectToValidate.category && [objectToValidate.category]}
              >
                {PRODUCT_CATEGORIES.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className='mb-2'>
            <label htmlFor='description' className='block text-gray-700 text-sm font-bold mb-2'>
              Product Description
            </label>
            <textarea placeholder='Enter product description' name='description' value={objectToValidate.description} onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

          <div className='flex gap-4 mb-4'>
            <div className='w-[50%]'>
              <label htmlFor='price_usd' className='block text-gray-700 text-sm font-bold mb-2'>
                Price in USD
              </label>
              <input
                value={objectToValidate.price_usd}
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
                value={objectToValidate.quantity}
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
              <label htmlFor='quality' className='block text-gray-700 text-sm font-bold mb-2'>
                Quality
              </label>
              <input
                value={objectToValidate.quality}
                type='text'
                name='quality'
                onChange={handleChange}
                className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                placeholder='Type the product quality'
              />
            </div>
            <div className='w-[50%]'>
              <label htmlFor='shipment' className='block text-gray-700 text-sm font-bold mb-2'>
                Shipment
              </label>
              <input
                value={objectToValidate.shipment}
                type='text'
                name='shipment'
                onChange={handleChange}
                className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                placeholder='Type shipment estimated months'
              />
            </div>
          </div>

          <div className='mb-2'>
            <label htmlFor='payment_terms' className='block text-gray-700 text-sm font-bold mb-2'>
              Payment Terms
            </label>
            <textarea value={objectToValidate?.payment_terms} placeholder='Enter the payment terms' name='payment_terms' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
          </div>

          <label
            htmlFor='hvi_file'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            HVI File
          </label>
          <p>{objectToValidate.hvi_file}</p>
          <FileUploader value={objectToValidate.hvi_file} classes='!border-dotted !border-gray-300 !p-14 !w-full !max-w-full !mb-4' label='Drop here your HVI file' className='bg-red-400' handleChange={handleChange} name='hvi_file' types={['PDF']} />

          <div className='flex'>
            {agents.length && (
              <Select
                items={agents}
                label='Agent assignment'
                variant='bordered'
                isMultiline
                name='agents'
                onChange={handleChange}
                selectionMode='multiple'
                placeholder='Select agent/agents'
                labelPlacement='outside'
                defaultSelectedKeys={objectToValidate?.agents ?? ''}
                classNames={{
                  label: 'font-bold',
                  base: 'w-[50%] mr-4',
                  trigger: 'min-h-unit-12 py-2 rounded-md border border-gray-300'
                }}
                renderValue={(agents) => {
                  return (
                    <div className='flex flex-wrap gap-2'>
                      {/* TODO: Show the avatar too here */}
                      {agents.map((agent) => (
                        <Chip key={agent.id}>{agent.data.name}</Chip>
                      ))}
                    </div>
                  )
                }}
              >
                {(agent) => (
                  <SelectItem key={agent.id} textValue={agent.name}>
                    <div className='flex gap-2 items-center'>
                      <Avatar alt={agent.name} name={agent.name} className='flex-shrink-0' size='sm' src={agent.image} />
                      <div className='flex flex-col'>
                        <span className='text-small'>{agent.name}</span>
                        <span className='text-tiny text-default-400'>{agent.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            )}

            {buyers.length && (
              <Select
                items={buyers}
                label='Offer to:'
                variant='bordered'
                isMultiline
                name='buyers'
                onChange={handleChange}
                selectionMode='multiple'
                placeholder='Select possible buyer/buyers'
                labelPlacement='outside'
                defaultSelectedKeys={objectToValidate?.buyers ?? ''}
                classNames={{
                  label: 'font-bold',
                  base: 'w-[50%]',
                  trigger: 'min-h-unit-12 py-2 rounded-md border border-gray-300'
                }}
                renderValue={(agents) => {
                  return (
                    <div className='flex flex-wrap gap-2'>
                      {/* TODO: Show the avatar too here */}
                      {agents.map((agent) => (
                        <Chip key={agent.id}>{agent.data.name}</Chip>
                      ))}
                    </div>
                  )
                }}
              >
                {(agent) => (
                  <SelectItem key={agent.id} textValue={agent.name}>
                    <div className='flex gap-2 items-center'>
                      <Avatar alt={agent.name} name={agent.name} className='flex-shrink-0' size='sm' src={agent.image} />
                      <div className='flex flex-col'>
                        <span className='text-small'>{agent.name}</span>
                        <span className='text-tiny text-default-400'>{agent.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            )}
            <label
              htmlFor='offer'
              className='block text-gray-700 text-sm font-bold mb-2'
            />

          </div>
        </form>
      )}
    </>
  )
}

export default ModalForm
