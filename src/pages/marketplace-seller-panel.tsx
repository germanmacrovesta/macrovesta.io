import React from 'react'
import NavBar from '~/components/NavBar'
import { useSession, getSession } from 'next-auth/react'
import { Button, Link } from '@nextui-org/react'
import { prisma } from '../server/db'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Avatar, AvatarGroup } from "@nextui-org/react"
import { useCallback } from 'react'
import { useCustomModal } from '~/context/ModalContext'
import { useDisclosure } from '@nextui-org/react'
import dynamic from 'next/dynamic'

const CustomModal = dynamic(() => import('../components/CustomModal'), { ssr: false })
// Only needs product + avaiable properties
const MarketPlaceSellerPanel = ({ marketplaceData }) => {
  const { data: session } = useSession()

  const columns = [
    { name: 'PRODUCT', uid: 'product' },
    { name: 'RELATED AGENTS', uid: 'agents' },
    { name: 'RESERVED BY', uid: 'reserved' },
    { name: 'ACTIONS', uid: 'actions' }
  ]

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { openModal } = useCustomModal()

  const handleOpenModal = (type, section, data) => {
    openModal(type, section, data)
    onOpen()
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const product = e.target.product?.value
    const stockTonnes = e.target.stock.value
    const description = e.target.description.value
    const priceUSD = e.target.price?.value
    const category = e.target.category?.value
    const imageUrl = e.target.image?.value

    try {
      const data = {
        product,
        stock_tonnes: stockTonnes,
        price_usd: priceUSD,
        description,
        category,
        image_url: imageUrl,
        added_by: session?.user?.name
      }
      console.log(data)

      const JSONdata = JSON.stringify(data)
      const endpoint = '/api/add-product'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSONdata
      }

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)
      console.log(response)
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  // TODO: Move to table component
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case 'product':
        return (
          <p className=''>
            {item.product}
          </p>
        )
      case 'reserved':
        return (
          <div className='flex flex-col'>
            <User
              avatarProps={{ radius: 'lg', src: '/Vic.jpeg' }}
              description='victor.email@gmail.com'
              name={'Victor Fernandez'}
            >
            </User>
          </div>
        )
      case 'agents':
        return (
          <div className='flex flex-col'>
            <AvatarGroup isBordered>
              <Avatar radius="lg" isBordered src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar radius="lg" isBordered src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar radius="lg" isBordered src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
          </div>
        )
      case 'actions':
        return (
          <div className='relative flex items-center justify-center gap-2'>
            <Tooltip content='Details'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </span>
            </Tooltip>
            <Tooltip content='Edit user'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Delete user'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  return (
    <main className='main h-full items-center bg-slate-200'>

      <NavBar session={session} />

      <div className='p-6 mx-8'>
        <Button className='mb-4' color='secondary' variant='flat' onPress={() => handleOpenModal('form', 'Add Product')}>
          Register new product
        </Button>
        <Table>
          <TableHeader columns={columns} className='flex justify-between'>
            {(column) => (
              <TableColumn key={column.uid} className={`${column.uid === 'product' ? 'text-left' : 'text-center'}`}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={JSON.parse(marketplaceData)}>
            {(item) => (
              <TableRow key={item.record_id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <form onSubmit={handleSubmit} className='mt-20 w-[50%] border rounded-lg p-4 shadow-md bg-slate-50'>
        <h1 className='mb-5 font-bold'>Add new product</h1>
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
        >
          Product name
        </label>
        <input
          type='text'
          id='product'
          required
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          placeholder='Enter the product name'
        />
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
        >
          Image Url
        </label>
        <input
          type='text'
          id='image'
          required
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          placeholder='Enter the image url'
        />
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
        >
          Category
        </label>
        <input
          type='text'
          id='category'
          required
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          placeholder='Enter the product category'
        />
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
        >
          Stock in tonnes
        </label>
        <input
          type='number'
          id='stock'
          required
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          placeholder='Enter the product stock'
        />
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
        >
          Description
        </label>
        <input
          type='text'
          id='description'
          required
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
          placeholder='Enter the product description'
        />
        <label
          htmlFor='cents_per_pound3'
          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
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
        <Button type='submit' variant='bordered' className='mt-5'>Add a product!</Button>

      </form>
      {isOpen && (
        <CustomModal
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          session={session}
        />
      )}
    </main >
  )
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession({ req: context.req })

  if (!session || session?.access_to_marketplace !== true) { // Typescript eslint warning
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const marketplace = await prisma?.marketplace.findMany({})
  const marketplaceData = JSON.stringify(marketplace)

  return {
    props: { marketplaceData }
  }
}

export default MarketPlaceSellerPanel
