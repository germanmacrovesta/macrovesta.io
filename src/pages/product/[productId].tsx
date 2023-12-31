import { useRouter } from 'next/router'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react'
import Carrousel from '~/components/Carrousel'
import { Accordion, AccordionItem, Button, Avatar } from '@nextui-org/react'
import DashboardFooter from '~/components/DashboardFooter'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useNotificationCount } from '~/context/NotificationContext'
import Swal from 'sweetalert2'
import { type NextPage } from 'next'
import { prisma } from '../../server/db'
import type { Product, User } from '@prisma/client'
import { parseDateString } from '~/utils/dateUtils'

interface ProductDetailed extends Product {
  agents: User[],
  buyers: User[]
}

const Product: NextPage<{
  product: ProductDetailed
}> = ({ product }) => {
  const { notificationCount, setNotificationCount } = useNotificationCount()
  const { data: session } = useSession()
  const router = useRouter()

  const slides = [
    '/product-mock-1.jpeg',
    '/product-mock-2.jpeg',
    '/product-mock-3.jpeg'
  ]

  // Reserve a product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = '/api/product'
    const method = 'PUT'

    console.log(session?.user?.id)
    Swal.fire({
      title: `Do you want to reserve ${product.name}`,
      text: 'Agent will contact with you after that',
      imageUrl: '/logo-small.png',
      imageWidth: 100,
      imageHeight: 90,
      imageAlt: "Custom image",
      showCancelButton: true,
      confirmButtonColor: '#051D6D',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, I want it!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading('Reserving product...')
        try {
          // Made the reserve
          toast.update(toastId, { render: 'Reserving Product', type: 'info', isLoading: true })
          // id and userId // Is reserving is only for proper endpoint check
          const data = { id: product.id, reserved_by: session?.user?.id, isReserving: true }
          const JSONdata = JSON.stringify(data)
          console.log(JSONdata)
          const options = {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSONdata
          }

          const response = await fetch(endpoint, options)
          const result = await response.json()


          // Send email
          if (result.message === 'Success') {
            const emailData = {
              subject: `${product.name} successfully reserved! - Macrovesta`,
              to: session?.user?.email,
              htmlText: `<p>${`You reserved the following product: ${product.name} x${product.quantity} tonnes, with quality ${product.quality} for ${product.price_usd}$`}</p>`,
              text: `Product ${product.name} reserved!`
            }
            const JSONEmaildata = JSON.stringify(emailData)
            const optionsEmail = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSONEmaildata
            }
            const responseEmail = await fetch('/api/send-email', optionsEmail)
            const resultEmail = await responseEmail.json()

            // Create a notification
            if (resultEmail.message === 'Success') {
              const notificationData = {
                title: `Your product ${product.name} has been reserved!`,
                description: `Quantity: ${product.quantity}, Quality: ${product.quantity}... Blah blah, whatever is required`,
                userId: session?.user?.id
              }
              const JSONNotificationData = JSON.stringify(notificationData)
              console.log(session?.user?.id)
              const optionsNotification = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSONNotificationData
              }

              const responseNotification = await fetch('/api/notification', optionsNotification)
              const resultNotification = await responseNotification.json()

              // All Ok, toast success
              if (resultNotification.message === 'Success') {
                toast.update(toastId, { render: `${product.name} reserved successfully!`, type: 'success', isLoading: false, autoClose: 5000 })
                setNotificationCount(notificationCount + 1)
                router.push('/marketplace')
              }
            }
          } else {
            toast.update(toastId, { render: 'Something goes wrong!', type: 'error', isLoading: false, autoClose: 5000 })
          }
        } catch (error) {
          toast.update(toastId, { render: 'Something goes wrong!', type: 'error', isLoading: false, autoClose: 5000 })
        }
      }
    })
  }

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name='description' content='Generated by Macrovesta' />
        <link rel='icon' href='/favicon.ico' />
        <script src='/static/datafeeds/udf/dist/bundle.js' async />
        <link rel='alternate' hrefLang='en' href='https://www.macrovesta.ai' />
        <link rel='alternate' hrefLang='pt-br' href='https://pt-br.macrovesta.ai' />
        <link rel='alternate' hrefLang='es' href='https://es.macrovesta.ai' />
        <link rel='alternate' hrefLang='tr' href='https://tr.macrovesta.ai' />
        <link rel='alternate' hrefLang='th' href='https://th.macrovesta.ai' />
      </Head>

      <main>
        <div className='md:grid md:grid-cols-2 mx-10 my-10 p-4 gap-8 bg-slate-50 rounded-xl shadow-md'>
          <Carrousel slides={slides} />
          <div className='flex flex-col justify-between'>

            <div className='mt-8 md:mt-0'>
              <h1 className='relative inline-block text-3xl -z-0 italic align-baseline'>
                {product.name}
                <span className='absolute -z-10 left-4 -bottom-1 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400' />
              </h1>
            </div>

            <div className='flex flex-col gap-1 mt-8 md:mt-0'>
              <p className='flex gap-2 items-baseline italic font-medium'>
                Quantity:
                <span className='font-normal not-italic'>
                  {product.quantity} tonnes
                </span>
              </p>

              <p className='flex gap-2 items-baseline italic font-medium'>
                Quality:
                <span className='font-normal not-italic'>
                  {product.quality}
                </span>
              </p>
              <p className='flex gap-2 items-baseline italic font-medium'>
                Shipment:
                <span className='font-normal not-italic'>
                  {product.shipment}
                </span>
              </p>

              <p className='flex gap-2 items-baseline italic font-medium'>
                PaymentTerms:
                <span className='font-normal not-italic'>
                  {product.payment_terms}
                </span>
              </p>

              <p className='flex gap-2 items-baseline italic font-medium'>
                Incoterm:
                <span className='font-normal not-italic'>
                  --
                </span>
              </p>

              <p className='flex gap-2 items-baseline italic font-medium'>
                Price:
                <span className='font-normal not-italic'>
                  {product.price_usd}$ on CTZ23
                </span>
              </p>
              <p className='flex gap-2 items-baseline italic font-medium'>
                Available until:
                <span className='font-normal not-italic'>
                  {parseDateString(product.expiry_date)}
                </span>
              </p>
            </div>
            <Button variant='flat' color='secondary' type='submit' onClick={handleSubmit} className='py-6 text-xl mt-8 md:mt-0'>Reserve Product</Button>
          </div>
        </div>

        <div className='flex mx-8'>
          <Accordion>
            <AccordionItem key='1' aria-label='MEET OUR AGENT' title='MEET OUR AGENT' className='bg-slate-100 rounded-xl shadow-md px-4'>

              {product.agents.map((agent) => (
                <div key={agent.id} className='flex justify-between items-center pb-2'>
                  <div className='flex gap-2 items-center'>
                    <Avatar alt={agent.name ?? undefined} name={agent.name ?? undefined} className='flex-shrink-0' size='sm' src={`/${agent.image}`} />
                    <div className='flex flex-col'>
                      <span className='text-small'>{agent.name}</span>
                      <span className='text-tiny text-default-400'>{agent.email}</span>
                    </div>
                  </div>
                  <Link href='/' className='text-default-400'>
                    Go to profile
                  </Link>
                </div>
              ))}
            </AccordionItem>
          </Accordion>
          <Accordion>
            <AccordionItem key='1' aria-label='MEET OUR AGENT' title='FAQ' className='bg-slate-100 rounded-xl shadow-md px-4'>
              Blah Blah
            </AccordionItem>
          </Accordion>
        </div>
        <DashboardFooter />
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { params } = context
  const session = await getSession({ req: context.req })
  console.log(session)

  if (!session || session?.access_to_marketplace !== true) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  // Product with agents and exclusive clients
  const productQuery = JSON.parse(JSON.stringify(await prisma?.product.findUnique({
    where: { id: params?.productId },
    include: {
      buyers: {
        select: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      agents: {
        select: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    }
  })))

  // Map the structure to correct showing inside component
  const product = {
    ...productQuery,
    buyers: productQuery?.buyers?.map((buyer) => buyer.buyer),
    agents: productQuery?.agents?.map((agent) => agent.agent)
  }

  return {
    props: { product }
  }
}

export default Product
