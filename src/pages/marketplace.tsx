import { type NextPage } from 'next'
import Head from 'next/head'
import { prisma } from '../server/db'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/router'
import React from 'react'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from '../../public/static/charting_library/charting_library'
import { useSession, getSession } from 'next-auth/react'
import useWeglotLang from '../components/useWeglotLang'
import { parseDateString } from '~/utils/dateUtils'
import Image from 'next/image'
import { Card, CardFooter, CardBody, CardHeader, Button, Select, SelectItem, Chip } from '@nextui-org/react'
import Footer from '~/components/footer'
import DashboardFooter from '~/components/DashboardFooter'
import { Divider } from '@nextui-org/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Home: NextPage = ({ marketplaceData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()

  const todaysDate = new Date()

  const baseUrlArray = url.split('/')
  const urlArray: any = []
  baseUrlArray.forEach((urlCrumb) => {
    if (urlCrumb.startsWith('[')) {
      urlArray.push(router.query[`${urlCrumb.slice(1, -1)}`])
    } else {
      urlArray.push(urlCrumb)
    }
  })
  let root = ''
  let urlPath = ''
  const splitUrl = (urlcrumbs: any, number: any) => {
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
  splitUrl(urlArray, 1)

  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.weglot.com/weglot.min.js'
    script.async = true

    script.onload = () => {
      Weglot.initialize({
        api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
      })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [marketplacePopup, setMarketplacePopup] = React.useState(null)
  const productOptions = [{ name: 'Cotton', parameter: 'cotton' }, { name: 'Cotton Waste', parameter: 'cotton waste' }]

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name="description" content="Generated by Macrovesta" />
        <link rel="icon" href="/favicon.ico" />
        <script src="/static/datafeeds/udf/dist/bundle.js" async />
        <link rel="alternate" hrefLang="en" href="https://www.macrovesta.ai" />
        <link rel="alternate" hrefLang="pt-br" href="https://pt-br.macrovesta.ai" />
        <link rel="alternate" hrefLang="es" href="https://es.macrovesta.ai" />
        <link rel="alternate" hrefLang="tr" href="https://tr.macrovesta.ai" />
        <link rel="alternate" hrefLang="th" href="https://th.macrovesta.ai" />
        {/* <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
        <script>
          {Weglot.initialize({
            api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
          })}
        </script> */}
      </Head>
      <main className="main h-full items-center bg-slate-200">

        <div className="flex w-full flex-col self-start">

          <NavBar session={session} />
          <div className="p-6 mx-8 bg-slate-200 mb-5">
            <div className='md:flex justify-between items-center '>
              <h1 className="relative inline-block text-3xl -z-0 italic align-baseline">
                Exclusive for you
                <span className="absolute -z-10 left-2 -bottom-1 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400"></span>
              </h1>
              <div className='flex justify-between md:justify-end items-center md:w-[50%]'>
                <Select
                  radius='md'
                  label='Category'
                  className='w-[50%]'
                  size='sm'
                  placeholder='Default: Cotton'
                  variant='underlined'
                  defaultSelectedKeys={['cotton']}
                >
                  {productOptions.map((option) => (
                    <SelectItem key={option.parameter} value={option.parameter}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

            </div>
            {/* TODO: Add loader */}
            {isClient && (
              <div className="grid md:grid-cols-4 md:grid-rows-2 gap-4 mt-4">
                {JSON.parse(marketplaceData).slice(0, 4).map((offer: any, index: any) => (
                  <div key={offer.product} className={`${index === 0
                    ? 'md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3'
                    : index === 1
                      ? 'md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-2'
                      : index === 2
                        ? 'md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3'
                        : index === 3
                          ? 'md:col-start-4 md:col-end-5 md:row-start-2 md:row-end-3'
                          : ''
                    }`}>
                    <Card className="p-0 hover:scale-[102%] h-full relative" href={`/product/${offer.record_id}`} as={Link}>
                      <CardBody className=" flex flex-col justify-between relative h-52 p-0 overflow-hidden z-0">
                        <div className='flex justify-between p-2'>
                          <h4 className="font-bold text-large text-white italic overflow-hidden truncate">{offer.product}</h4>
                          <Chip
                            variant="shadow"
                            classNames={{
                              base: `${offer.category === 'waste' ? 'from-yellow-500 to-red-500 shadow-red-500/30' : 'from-yellow-500 to-green-500 shadow-green-500/30'} bg-gradient-to-br p-0 italic rounded-lg uppercase text-tiny`,
                              content: 'drop-shadow shadow-black text-white m-0'
                            }}
                          >
                            {offer.category}
                          </Chip>
                        </div>

                        {/* Gradient layer */}
                        <div className='flex flex-col justify-between absolute w-full h-full -z-10 '>
                          <div className='bg-gradient-to-b from-black to-transparent w-full h-[35%] opacity-80'></div>
                          <div className='bg-gradient-to-t from-black to-transparent w-full h-[35%] opacity-80 '></div>
                        </div>

                        <Image
                          alt="Card background"
                          className="absolute -z-20 "
                          src={`/product-mock-${index}.jpeg`}
                          fill={true}
                          sizes="(max-width: 768px) 100vw"
                          style={{ objectFit: 'cover' }}
                        />

                        <div className='flex justify-between items-center p-2'>
                          <div className='mt-auto'>
                            <div className={`${(index === 2 || index === 3) && 'md:hidden 2xl:flex'} flex gap-2`} >
                              <Chip
                                startContent={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                  <path d="M2 4.5A2.5 2.5 0 014.5 2h11a2.5 2.5 0 010 5h-11A2.5 2.5 0 012 4.5zM2.75 9.083a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 12.663a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 16.25a.75.75 0 000 1.5h14.5a.75.75 0 100-1.5H2.75z" />
                                </svg>

                                }
                                color=''
                              >
                                <p className='truncate text-white'>
                                  {offer.quantity} Tonnes
                                </p>
                              </Chip>
                              <Chip
                                className={`${(index === 2 || index === 3) && '2xl:hidden'}`}
                                startContent={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                  <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                                </svg>
                                }
                                color=''
                              >
                                <p className='max-w-[100px] text-white overflow-hidden truncate'>
                                  {offer.quality}
                                </p>
                              </Chip>
                            </div>

                          </div>

                          <h1 className='text-white mt-auto text-4xl bg-gradient-to-br rounded-xl italic uppercase whitespace-nowrap '>
                            {offer.price_usd}
                            <span className='text-xs'>
                              $ on CTZ23
                            </span>
                          </h1>

                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            <Divider className='mt-10'></Divider>
            <div className='md:flex justify-between items-center my-5'>
              <h1 className="relative inline-block text-3xl -z-0 italic ">
                Featured Products
                <span className="absolute -z-10 left-2 -bottom-1 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400"></span>
              </h1>
              <Select
                radius='md'
                label='Category'
                className='md:max-w-sm'
                size='sm'
                placeholder='Default: Cotton'
                variant='underlined'
                defaultSelectedKeys={['cotton']}
              >
                {productOptions.map((option) => (
                  <SelectItem key={option.parameter} value={option.parameter}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
              {JSON.parse(marketplaceData).slice(0, 4).map((offer: any, index: any) => (
                <div key={offer.product}>
                  <Card className="p-0 hover:scale-[102%] h-full relative" href={`/product/${offer.record_id}`} as={Link}>
                    <CardBody className=" flex flex-col justify-between relative h-52 p-0 overflow-hidden z-0">
                      <div className='flex justify-between p-2'>
                        <h4 className="font-bold text-large text-white italic overflow-hidden truncate">{offer.product}</h4>
                        <Chip
                          variant="shadow"
                          classNames={{
                            base: `${offer.category === 'waste' ? 'from-yellow-500 to-red-500 shadow-red-500/30' : 'from-yellow-500 to-green-500 shadow-green-500/30'} bg-gradient-to-br p-0 italic rounded-lg uppercase text-tiny`,
                            content: 'drop-shadow shadow-black text-white m-0'
                          }}
                        >
                          {offer.category}
                        </Chip>
                      </div>

                      {/* Gradient layer */}
                      <div className='flex flex-col justify-between absolute w-full h-full -z-10 '>
                        <div className='bg-gradient-to-b from-black to-transparent w-full h-[35%] opacity-80'></div>
                        <div className='bg-gradient-to-t from-black to-transparent w-full h-[35%] opacity-80 '></div>
                      </div>

                      <Image
                        alt="Card background"
                        className="absolute -z-20 "
                        src={`/product-mock-${index}.jpeg`}
                        fill={true}
                        sizes="(max-width: 768px) 100vw"
                        style={{ objectFit: 'cover' }}
                      />

                      <div className='flex justify-between items-center p-2'>
                        <div className='mt-auto'>
                          <div className='flex gap-2' >
                            <Chip
                              startContent={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M2 4.5A2.5 2.5 0 014.5 2h11a2.5 2.5 0 010 5h-11A2.5 2.5 0 012 4.5zM2.75 9.083a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 12.663a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 16.25a.75.75 0 000 1.5h14.5a.75.75 0 100-1.5H2.75z" />
                              </svg>

                              }
                              color=''
                            >
                              <p className='truncate text-white'>
                                {offer.quantity} Tonnes
                              </p>
                            </Chip>
                            <Chip
                              className='md:hidden'
                              startContent={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                              </svg>
                              }
                              color=''
                            >
                              <p className='max-w-[100px] text-white overflow-hidden truncate'>
                                {offer.quality}
                              </p>
                            </Chip>
                          </div>

                        </div>

                        <h1 className='text-white mt-auto text-4xl bg-gradient-to-br rounded-xl italic uppercase whitespace-nowrap '>
                          {offer.price_usd}
                          <span className='text-xs'>
                            $ on CTZ23
                          </span>
                        </h1>

                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DashboardFooter />
      </main >
    </>
  )
}

// some random shit added by Vic
export const getServerSideProps = async (context: any) => {
  const session = await getSession({ req: context.req })

  if (!session || session?.access_to_marketplace !== true) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const marketplace = await prisma?.marketplace.findMany({
    where: {
      reserved_by: null
    }
  })
  const marketplaceData = JSON.stringify(marketplace)

  return {
    props: { marketplaceData }
  }
}

export default Home
