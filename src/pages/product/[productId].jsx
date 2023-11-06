import { PrismaClient } from '@prisma/client'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react'
import NavBar from '~/components/NavBar'
import Carrousel from '~/components/Carrousel'
import { Accordion, AccordionItem, Button, Avatar } from '@nextui-org/react'
import DashboardFooter from '~/components/DashboardFooter'
import Link from 'next/link'
import { toast } from 'react-toastify'

const prisma = new PrismaClient()

const ProductDetail = ({ productData }) => {
  const router = useRouter()
  const url = router.pathname
  const { data: session } = useSession()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const baseUrlArray = url.split('/')
  const urlArray = []
  baseUrlArray.forEach((urlCrumb) => {
    if (urlCrumb.startsWith('[')) {
      urlArray.push(router.query[`${urlCrumb.slice(1, -1)}`])
    } else {
      urlArray.push(urlCrumb)
    }
  })
  let root = ''
  let urlPath = ''
  const splitUrl = (urlcrumbs, number) => {
    for (let i = 1; i < urlcrumbs.length; i++) {
      if (i < number) {
        root += '/'
        root += urlcrumbs[i]
      } else {
        urlPath += '/'
        urlPath += urlcrumbs[i]
      }
    }
  }
  console.log(splitUrl(urlArray, 1))
  const product = JSON.parse(productData)
  console.log(product)
  const slides = [
    '/product-mock-1.jpeg',
    '/product-mock-2.jpeg',
    '/product-mock-3.jpeg'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = '/api/edit-product'
    const method = 'PUT'

    console.log(session?.user)
    setTimeout(async () => { /* Cause button animation needs time to complete 100ms* TODO: Remove when popup confirms added */
      const answer = window.confirm(`Want to reserve ${product.product}? You will receive an email with product details.`)
      if (answer) {
        try {
          getSession
          // record_id and User email for reservation // Is reserving is only for proper endpoint check
          const data = { record_id: product.record_id, reserved_by: session?.user?.email, isReserving: true }
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
          if (result.message === 'Success') {
            // Send email
            const emailData = {
              subject: `${product.product} successfully reserved! - Macrovesta`,
              to: session?.user?.email,
              htmlText: `<p>${`You reserved the following product: ${product.product} x${product.quantity} tonnes, with quality ${product.quality} for ${product.price_usd}$`}</p>`,
              text: `Product ${product.product} reserved!`
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
            if (resultEmail.message === 'Success') {
              // Save alert into DB
              const notificationData = {
                title: `Your product ${product.product} has been reserved!`,
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
              const responseNotification = await fetch('/api/store-notification', optionsNotification)
              console.log(responseNotification)
              const resultNotification = await responseNotification.json()
              console.log(resultNotification)
              if (resultNotification.message === 'Success' && !toast.isActive()) {
                toast('Product Reserved!')
              }
            }
          } else {
            toast('Ops! Something goes wrong.')
          }
        } catch (error) {
          console.log(error)
        }
      }
    }, 100)
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
                {product.product}
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
            </div>
            <Button variant='flat' color='secondary' type='submit' onClick={handleSubmit} className='py-6 text-xl mt-8 md:mt-0'>Reserve Product</Button>
          </div>
        </div>

        <div className='flex mx-8'>
          <Accordion>
            <AccordionItem key='1' aria-label='MEET OUR AGENT' title='MEET OUR AGENT' className='bg-slate-100 rounded-xl shadow-md px-4'>

              {product.agents.map((agent, index) => (
                <div key={agent.agent.email} className='flex justify-between items-center pb-2'>
                  <div className='flex gap-2 items-center'>
                    <Avatar alt={agent.agent.name} name={agent.agent.name} className='flex-shrink-0' size='sm' src={`/${agent.agent.image}`} />
                    <div className='flex flex-col'>
                      <span className='text-small'>{agent.agent.name}</span>
                      <span className='text-tiny text-default-400'>{agent.agent.email}</span>
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
  const product = await prisma.marketplace.findUnique({
    where: { record_id: params.productId },
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
  })

  const productData = JSON.stringify(product)
  console.log(JSON.parse(productData))
  return {
    props: { productData }
  }
}

export default ProductDetail
