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
// Only needs product + available properties
const MarketPlaceSellerPanel = ({ marketplaceData, agentsData }) => {
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
            <Tooltip content='See Details'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

              </span>
            </Tooltip>
            <Tooltip content='Edit Product'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </span>
            </Tooltip>
            <Tooltip color='danger' content='Delete Product'>
              <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
    <main className='main h-screen items-center bg-slate-200'>

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

      {isOpen && (
        <CustomModal
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          session={session}
          size='4xl'
          scrollBehavior='inside'
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
  const productsWithAgents = await prisma.marketplace.findMany({
    select: {
      product: true,
      category: true,
      quantity: true,
      quality: true,
      description: true,
      image_url: true,
      price_usd: true,
      added_by: true,
      hvi_file: true,
      shipment: true,
      payment_terms: true,
      agents: {
        select: {
          name: true,
          email: true
        },
        where: {
          role: 'admin' // Filtra los usuarios por el rol "agent"
        }
      },
      date_created: true
    }
  })

  // Bring agents related to a productId
  const marketplace = await prisma?.marketplace.findMany({})
  const agentsRelatedToAProduct = await prisma.marketplace_agent.findMany({
    where: {
      marketplace_id: 'clo75z73f0000o3xg1gqzp14t'
    }
  })
  console.log(agentsRelatedToAProduct)

  // Bring all avaible agents (For <Select>)
  const agents = await prisma.user.findMany({
    where: {
      role: 'admin' // Agents or whatever
    },
    select: {
      name: true,
      email: true
    }
  })

  const agentsData = JSON.stringify(agents)

  const marketplaceData = JSON.stringify(marketplace)

  return {
    props: { marketplaceData, agentsData }
  }
}

export default MarketPlaceSellerPanel
