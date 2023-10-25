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

  const [openSuggestionForm, setOpenSuggestionForm] = React.useState(false)

  const [selectedSuggestionType, setSelectedSuggestionType] = React.useState('')

  const [suggestionError_Message, setSuggestionError_Message] = React.useState('')
  const [suggestionSubmitted, setSuggestionSubmitted] = React.useState(false)
  const [suggestionSubmitting, setSuggestionSubmitting] = React.useState(false)
  const [suggestionWarning_Message, setSuggestionWarning_Message] = React.useState('')
  const [suggestionWarningSubmit, setSuggestionWarningSubmit] = React.useState(false)

  const handleSuggestionFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSuggestionSubmitting(true)

    let suggestion_type = ''
    // let title = e.target["title"].value;
    const text = e.target.text.value
    // let image = e.target["image"].value;
    let errorMessage = ''
    const warningMessage = ''

    // console.log("textarea", text == "")

    if (selectedSuggestionType != null && selectedSuggestionType != '' && selectedSuggestionType != 'Select Suggestion Type') {
      suggestion_type = selectedSuggestionType
    } else {
      errorMessage += 'Please select a suggestion type. '
    }
    // if (title == null || title == "") {
    //   errorMessage += "Please enter a title. ";
    // }
    if (text == null || text == '') {
      errorMessage += 'Please enter a text. '
    }
    // if (image == null || image == "") {
    //   warningMessage += "You can add an image as well. If you don't want to just click confirm. ";
    // }

    // if (warningMessage !== "") {
    //   setSuggestionWarning_Message(warningMessage);
    //   // throw new Error(errorMessage)
    // } else {
    //   if (suggestionWarning_Message != "") {
    //     setSuggestionWarning_Message("")
    //   }
    // }

    if (errorMessage != '') {
      setSuggestionError_Message(errorMessage)
      setSuggestionWarningSubmit(false)
      setSuggestionSubmitting(false)
    } else {
      if (suggestionError_Message != '') {
        setSuggestionError_Message('')
      }

      if (suggestionWarningSubmit == false && warningMessage != '') {
        setSuggestionWarningSubmit(true)
        setSuggestionSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          text,
          user: session?.user?.name,
          suggestion_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-suggestion'

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json'
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json().then(() => { setSuggestionSubmitted(true); setSuggestionSubmitting(false) })
        // setSnapshotSubmitted(true); setSnapshotSubmitting(false)
      }
    }
  }

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
            <div className='flex justify-end'>
              <Button as={Link} color='danger' className='w-[25%]' href='/marketplace-seller-panel' variant='flat'>
                Marketplace Seller panel
              </Button>
            </div>
            <div className='md:flex justify-between items-center '>
              <h1 className="relative inline-block text-xl -z-0 italic align-baseline">
                Featured Products
                <span className="absolute -z-10 left-2 bottom-0 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400"></span>
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
                  <Card className="p-0 hover:scale-[102%] h-full relative" >
                    <CardBody className=" flex flex-col justify-between relative h-52 p-0 overflow-hidden z-0">
                      <div className='flex justify-between p-4'>
                        <h4 className="font-bold text-large text-white italic">{offer.product}</h4>
                        <Chip
                          variant="shadow"
                          classNames={{
                            base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30',
                            content: 'drop-shadow shadow-black text-white'
                          }}
                        >
                          {offer.category}
                        </Chip>
                      </div>

                      {/* Gradient layer */}
                      <div className='flex flex-col justify-between absolute w-full h-full -z-10 '>
                        <div className='bg-gradient-to-b from-black to-transparent w-full h-[40%] opacity-80'></div>
                        <div className='bg-gradient-to-t from-black to-transparent w-full h-[40%] opacity-80 '></div>
                      </div>

                      <Image
                        alt="Card background"
                        className="absolute -z-20 "
                        src='/product-mock-1.jpeg'
                        fill={true}
                        sizes="(max-width: 768px) 100vw"
                        style={{ objectFit: 'cover' }}
                      />

                      <div className='flex justify-between items-center p-4'>
                        <Chip variant='dot' className='text-white' color={`${offer.quantity > 10
                          ? 'success'
                          : offer.quantity > 5
                            ? 'warning'
                            : 'danger'
                          }`}>
                          <span className={`${index === 0 || index === 1 ? 'md:inline' : ''} hidden`}>Available Stock </span>
                          {offer.quantity}
                        </Chip>

                        <Button href={`/product/${offer.record_id}`} as={Link} variant='ghost' className='text-white'>
                          Check Product
                        </Button>

                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>

            <div className='md:flex justify-between items-center my-5'>
              <h1 className="relative inline-block text-xl -z-0 italic">
                Exclusive for you
                <span className="absolute -z-10 left-2 bottom-0 w-full h-[20%] bg-gradient-to-r from-transparent via-transparent to-green-400"></span>
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
                  <Card className="py-4 hover:scale-105 h-full" >
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <p className="text-tiny uppercase font-bold">{offer.category}</p>
                      <small className={`${offer.stock_tonnes > 10
                        ? 'text-green-600'
                        : offer.quantity > 5
                          ? 'text-orange-600'
                          : 'text-red-600'
                        } text-default-500`}>Available Stock {offer.quantity}</small>
                      <h4 className="font-bold text-large">{offer.product}</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src='/product-mock-1.jpeg'
                        width={100}
                        height={100}
                      />
                      <Button variant='ghost'>
                        Check Product
                      </Button>
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

  const marketplace = await prisma?.marketplace.findMany({})
  const marketplaceData = JSON.stringify(marketplace)

  return {
    props: { marketplaceData }
  }
}

export default Home
