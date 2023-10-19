import { type NextPage } from 'next'
import Head from 'next/head'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import Breadcrumbs from '../components/breadcrumbs'
import { useRouter } from 'next/router'
import React from 'react'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from '../../public/static/charting_library/charting_library'
import { useSession, getSession } from 'next-auth/react'
import useWeglotLang from '../components/useWeglotLang'
import { Button } from '@nextui-org/react'
import { parseDateString } from '~/utils/dateUtils'

const Home: NextPage = ({ marketplaceData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()
  console.log('session', session)
  console.log('session.submittedSurvey', session?.submittedSurvey)

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
      <main className="main grid grid-cols-[160px_auto] h-screen items-center bg-slate-200">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-50 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Improvements'} urlPath={urlPath} user={session?.user.name} />
            {/* <TabMenu data={TabMenuArray} urlPath={urlPath} /> */}
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="text-lg font-semibold text-center mb-2">
                Strategy Log
              </div>
              <div className="flex flex-col gap-y-4">
                {JSON.parse(marketplaceData).map((offer) => (
                  <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setMarketplacePopup(offer)}>
                    <div>
                      {offer?.product}
                    </div>
                    <div>
                      {parseDateString(offer?.date_created)}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className='mt-20 w-[50%] border rounded-lg p-4 shadow-md'>
                <h1 className='mb-5 font-bold'>Add new product</h1>
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Product name
                </label>
                <input
                  type="text"
                  id="product"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the product name"
                />
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Image Url
                </label>
                <input
                  type="text"
                  id="image"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the image url"
                />
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the product category"
                />
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Stock in tonnes
                </label>
                <input
                  type="number"
                  id="stock"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the product stock"
                />
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the product description"
                />
                <label
                  htmlFor="cents_per_pound3"
                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                >
                  Price in USD
                </label>
                <input
                  type="text"
                  id="price"
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Enter the product Price"
                />
                <Button type='submit' variant='bordered' className='mt-5' >Add a product!</Button>

              </form>

              {marketplacePopup != null && (
                <div className='absolute modal left-0 top-0 z-40'>
                  <div className=' fixed grid place-content-center inset-0 z-40'>
                    <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                      {/* <img className="w-3/4" src={strategyPopup.image_of_in_country_news} /> */}
                      <div className="my-4 font-semibold text-lg">
                        {marketplacePopup.product}
                      </div>
                      <div className="-mt-4 mb-2">
                        {parseDateString(marketplacePopup.date_created)}
                      </div>
                      <div className="">
                        {/* <ReactMarkdown children={strategyPopup.text_of_in_country_news} /> */}
                        {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                        {/* {(strategyPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                        {/* {strategyPopup.text.split('[newline]').map((paragraph, index) => (
                          <>
                            <p>{paragraph}</p>
                            {index != strategyPopup.text.split('[newline]').length - 1 && (
                              <>
                                <br />
                              </>
                            )}
                          </>
                        ))} */}
                        Stock (tonnes):&nbsp;{marketplacePopup.stock_tonnes}
                      </div>
                      <div>Price (usd):&nbsp;{marketplacePopup.price_usd}</div>
                    </div>
                    <div onClick={() => setMarketplacePopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
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
