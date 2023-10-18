import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import Breadcrumbs from '../components/breadcrumbs'
import TabMenu from '../components/tabmenu'
import { useRouter } from 'next/router'
import { TabMenuArray } from '../components/tabMenuArray'
import React from 'react'
import SingleSelectDropdown from '../components/singleSelectDropdown'
import { TVChartContainer } from '../components/TVChartContainer'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from '../../public/static/charting_library/charting_library'
import GroupedBarChart from '../components/groupedBarChart'
import LineGraph from '../components/lineGraph'
import LineGraphNotTime from '../components/lineGraphNotTime'
import FormSubmit from '../components/formSubmit'
import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'
import BullishBearishDonut from '../components/bullishBearishDonut'
import { useSession, getSession } from 'next-auth/react'
import Comments from '../components/comments'
import IndexDial from '../components/indexDial'
import SemiCircleDial from '../components/semiCircleDial'
import MultipleSelectDropdown from '../components/multipleSelectDropdown'
import DateField from '../components/dateField'
import { useDateFormatter, useLocale } from 'react-aria'
import { parseDate } from '@internationalized/date'
import { WeglotLanguageSwitcher } from '~/components/weglotLanguageSwitcher'
import useWeglotLang from '../components/useWeglotLang'
import InfoButton from '../components/infoButton'
import { getEstimatesData } from '~/utils/getDataUtils'
import { parseDateString } from '~/utils/dateUtils'
import PositionClientInfo from '~/components/PositionClientInfo'
// const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
//   symbol: 'AAPL',
//   interval: '1D' as ResolutionString,
//   library_path: '/static/charting_library/',
//   locale: 'en',
//   charts_storage_url: 'https://saveload.tradingview.com',
//   charts_storage_api_version: '1.1',
//   client_id: 'tradingview.com',
//   user_id: 'public_user_id',
//   fullscreen: false,
//   autosize: true
// }

const Home: NextPage = ({ companyData, productionData, costData, commercialisationData, strategyLogData, fixedData, unfixedData, premiumCompaniesData }) => {
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

  const [strategyPopup, setStrategyPopup] = React.useState(null)

  const [openProductionForm, setOpenProductionForm] = React.useState(false)

  const [productionError_Message, setProductionError_Message] = React.useState('')
  const [productionSubmitted, setProductionSubmitted] = React.useState(false)
  const [productionSubmitting, setProductionSubmitting] = React.useState(false)
  const [productionWarning_Message, setProductionWarning_Message] = React.useState('')
  const [productionWarningSubmit, setProductionWarningSubmit] = React.useState(false)

  const [openCostForm, setOpenCostForm] = React.useState(false)

  const [costError_Message, setCostError_Message] = React.useState('')
  const [costSubmitted, setCostSubmitted] = React.useState(false)
  const [costSubmitting, setCostSubmitting] = React.useState(false)
  const [costWarning_Message, setCostWarning_Message] = React.useState('')
  const [costWarningSubmit, setCostWarningSubmit] = React.useState(false)

  const [openCommercialisationForm, setOpenCommercialisationForm] = React.useState(false)

  const [commercialisationError_Message, setCommercialisationError_Message] = React.useState('')
  const [commercialisationSubmitted, setCommercialisationSubmitted] = React.useState(false)
  const [commercialisationSubmitting, setCommercialisationSubmitting] = React.useState(false)
  const [commercialisationWarning_Message, setCommercialisationWarning_Message] = React.useState('')
  const [commercialisationWarningSubmit, setCommercialisationWarningSubmit] = React.useState(false)

  const [openUnfixedForm, setOpenUnfixedForm] = React.useState(false)

  const [unfixedError_Message, setUnfixedError_Message] = React.useState('')
  const [unfixedSubmitted, setUnfixedSubmitted] = React.useState(false)
  const [unfixedSubmitting, setUnfixedSubmitting] = React.useState(false)
  const [unfixedWarning_Message, setUnfixedWarning_Message] = React.useState('')
  const [unfixedWarningSubmit, setUnfixedWarningSubmit] = React.useState(false)

  const [openFixedForm, setOpenFixedForm] = React.useState(false)

  const [fixedError_Message, setFixedError_Message] = React.useState('')
  const [fixedSubmitted, setFixedSubmitted] = React.useState(false)
  const [fixedSubmitting, setFixedSubmitting] = React.useState(false)
  const [fixedWarning_Message, setFixedWarning_Message] = React.useState('')
  const [fixedWarningSubmit, setFixedWarningSubmit] = React.useState(false)

  const handleProductionFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setProductionSubmitting(true)

    const production1 = e.target.production1.value
    const yield1 = e.target.yield1.value
    const production2 = e.target.production2.value
    const yield2 = e.target.yield2.value
    const production3 = e.target.production3.value
    const yield3 = e.target.yield3.value
    let errorMessage = ''
    const warningMessage = ''

    if (production1 == null || production1 === '') {
      errorMessage += 'Please enter an estimate. '
    }

    if (warningMessage !== '') {
      setProductionWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (productionWarning_Message !== '') {
        setProductionWarning_Message('')
      }
    }

    if (errorMessage !== '') {
      setProductionError_Message(errorMessage)
      setProductionWarningSubmit(false)
      setProductionSubmitting(false)
    } else {
      if (productionError_Message !== '') {
        setProductionError_Message('')
      }

      if (productionWarningSubmit === false && warningMessage != '') {
        setProductionWarningSubmit(true)
        setProductionSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          production1,
          production2,
          production3,
          yield1,
          yield2,
          yield3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-producer-production-position'

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
        const result = await response.json().then(() => { setProductionSubmitted(true); setProductionSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const handleCostFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setCostSubmitting(true)

    const dollars_per_hectare1 = e.target.dollars_per_hectare1.value
    const cents_per_pound1 = e.target.cents_per_pound1.value
    const dollars_per_hectare2 = e.target.dollars_per_hectare2.value
    const cents_per_pound2 = e.target.cents_per_pound2.value
    const dollars_per_hectare3 = e.target.dollars_per_hectare3.value
    const cents_per_pound3 = e.target.cents_per_pound3.value
    const errorMessage = ''
    const warningMessage = ''

    // if (comment == null || comment == "") {
    //   errorMessage += "Please enter a comment. ";
    // }

    if (warningMessage !== '') {
      setCostWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (costWarning_Message != '') {
        setCostWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setCostError_Message(errorMessage)
      setCostWarningSubmit(false)
      setCostSubmitting(false)
    } else {
      if (costError_Message != '') {
        setCostError_Message('')
      }

      if (costWarningSubmit == false && warningMessage != '') {
        setCostWarningSubmit(true)
        setCostSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          dollars_per_hectare1,
          dollars_per_hectare2,
          dollars_per_hectare3,
          cents_per_pound1,
          cents_per_pound2,
          cents_per_pound3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-producer-cost-position'

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
        const result = await response.json().then(() => { setCostSubmitted(true); setCostSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const handleCommercialisationFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setCommercialisationSubmitting(true)

    const percentage1 = e.target.percentage1.value
    const percentage2 = e.target.percentage2.value
    const percentage3 = e.target.percentage3.value
    const errorMessage = ''
    const warningMessage = ''

    if (warningMessage !== '') {
      setCommercialisationWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (commercialisationWarning_Message != '') {
        setCommercialisationWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setCommercialisationError_Message(errorMessage)
      setCommercialisationWarningSubmit(false)
      setCommercialisationSubmitting(false)
    } else {
      if (commercialisationError_Message != '') {
        setCommercialisationError_Message('')
      }

      if (commercialisationWarningSubmit == false && warningMessage != '') {
        setCommercialisationWarningSubmit(true)
        setCommercialisationSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          percentage1,
          percentage2,
          percentage3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-producer-commercialisation-position'

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
        const result = await response.json().then(() => { setCommercialisationSubmitted(true); setCommercialisationSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const handleUnfixedFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setUnfixedSubmitting(true)

    const contract = e.target.contract?.value
    const futures_month = e.target.futures_month?.value
    const fix_by = e.target.fix_by?.value
    const basis = e.target.basis?.value
    const percentage = e.target.percentage?.value
    const remaining = e.target.remaining?.value
    const fixed_price = e.target.fixed_price?.value
    const errorMessage = ''
    const warningMessage = ''

    if (warningMessage !== '') {
      setUnfixedWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (unfixedWarning_Message != '') {
        setUnfixedWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setUnfixedError_Message(errorMessage)
      setUnfixedWarningSubmit(false)
      setUnfixedSubmitting(false)
    } else {
      if (unfixedError_Message != '') {
        setUnfixedError_Message('')
      }

      if (unfixedWarningSubmit == false && warningMessage != '') {
        setUnfixedWarningSubmit(true)
        setUnfixedSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          contract,
          futures_month,
          fix_by,
          basis,
          percentage,
          remaining,
          fixed_price,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-unfixed-cotton'

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
        const result = await response.json().then(() => { setUnfixedSubmitted(true); setUnfixedSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const handleFixedFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setFixedSubmitting(true)

    const contract = e.target.contract?.value
    const futures_month = e.target.futures_month?.value
    const basis = e.target.basis?.value
    const price = e.target.price?.value
    const amount = e.target.amount?.value
    const errorMessage = ''
    const warningMessage = ''

    if (warningMessage !== '') {
      setFixedWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (fixedWarning_Message != '') {
        setFixedWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setFixedError_Message(errorMessage)
      setFixedWarningSubmit(false)
      setFixedSubmitting(false)
    } else {
      if (fixedError_Message != '') {
        setFixedError_Message('')
      }

      if (fixedWarningSubmit == false && warningMessage != '') {
        setFixedWarningSubmit(true)
        setFixedSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          contract,
          futures_month,
          basis,
          fixed: price,
          quantity: amount,
          selected_contract: modifyingContract,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-fixed-cotton'

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
        const result = await response.json().then(() => { setFixedSubmitted(true); setFixedSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const [selectedSeason, setSelectedSeason] = React.useState('22/23')

  const [partiallyFixed, setPartiallyFixed] = React.useState(false)
  const [modifyingExistingContract, setModifyingExistingContract] = React.useState(false)
  const [modifyingContract, setModifyingContract] = React.useState(undefined)

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
          <header className="z-40 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Position'} urlPath={urlPath} user={session?.user.name} />
            {/* <TabMenu data={TabMenuArray} urlPath={urlPath} /> */}
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">

            <PositionClientInfo
              companyData={companyData}
              premiumCompaniesData={premiumCompaniesData}
              session={session}
              router={router}
            />

            {/* {JSON.parse(productionData).length}
            {JSON.parse(costData).length}
            {JSON.parse(commercialisationData).length} */}
            {JSON.parse(companyData)?.type === 'producer' && (
              <>
                <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                  <div className="w-[200px] self-center">
                    <SingleSelectDropdown
                      options={[{ name: '22/23', parameter: '22/23' }, { name: '23/24', parameter: '23/24' }, { name: '24/25', parameter: '24/25' }]}
                      label="Parameter"
                      variable="name"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setSelectedSeason(e.parameter)}
                      placeholder="Select Parameter"
                      searchPlaceholder="Search Parameter"
                      includeLabel={false}
                      defaultValue="22/23"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <div className="mt-6 -mb-2 font-semibold text-center">Production {selectedSeason}</div>
                      <div className="mb-16 w-full">

                        <LineGraph data={getEstimatesData(JSON.parse(productionData).filter((estimate) => estimate.season === selectedSeason), ['production_estimate'], ['Production Estimate'])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Production" />
                      </div>
                    </div>
                    <div>
                      <div className="mt-6 -mb-2 font-semibold text-center">Yield {selectedSeason}</div>
                      <div className="mb-16 w-full">

                        <LineGraph data={getEstimatesData(JSON.parse(productionData).filter((estimate) => estimate.season === selectedSeason), ['yield_estimate'], ['Yield Estimate'])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Production" />
                      </div>
                    </div>
                  </div>
                  <div className="grid place-content-center">
                    <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenProductionForm(true)}>Update your Production</div>
                    {openProductionForm && (
                      <div className='absolute text-black modal left-0 top-0 z-40'>
                        <div className=' fixed grid place-content-center inset-0 z-40'>
                          <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                            <div className="my-4 text-black font-semibold text-lg">
                              Update your production
                            </div>
                            <div className="w-full">
                              <form className="mt-4 mb-4 pl-4 grid grid-cols-2 gap-x-4 w-full" onSubmit={handleProductionFormSubmit}>
                                <div className="col-span-2 text-center py-2 font-semibold">22/23 Season</div>
                                <div>
                                  <label
                                    htmlFor="production1"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Production
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="production1"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="yield1"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Yield
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="yield1"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>
                                <div>
                                  <label
                                    htmlFor="production2"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Production
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="production2"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="yield2"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Yield
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="yield2"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>
                                <div>
                                  <label
                                    htmlFor="production3"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Production
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="production3"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="yield3"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Yield
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="yield3"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 flex justify-center pt-4">
                                  {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                                  <FormSubmit errorMessage={productionError_Message} warningMessage={productionWarning_Message} submitted={productionSubmitted} submitting={productionSubmitting} warningSubmit={productionWarningSubmit} />
                                </div>
                              </form>
                            </div>
                          </div>
                          <div onClick={() => setOpenProductionForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <div className="mt-6 -mb-2 font-semibold text-center">Dollars per Hectare {selectedSeason}</div>
                      <div className="mb-16 w-full">

                        <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == selectedSeason), ['cost_estimate_dollar_per_hectare'], [''])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                      </div>
                    </div>
                    <div>
                      <div className="mt-6 -mb-2 font-semibold text-center">Cents per Pound {selectedSeason}</div>
                      <div className="mb-16 w-full">

                        <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == selectedSeason), ['cost_estimate_cent_per_pound'], [''])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                      </div>
                    </div>
                  </div>
                  <div className="grid place-content-center">
                    <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenCostForm(true)}>Update your Cost of Production</div>
                    {openCostForm && (
                      <div className='absolute text-black modal left-0 top-0 z-40'>
                        <div className=' fixed grid place-content-center inset-0 z-40'>
                          <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                            <div className="my-4 text-black font-semibold text-lg">
                              Update your cost of production
                            </div>
                            <div className="w-full">
                              <form className="mt-4 mb-4 pl-4 grid grid-cols-2 gap-x-4 w-full" onSubmit={handleCostFormSubmit}>
                                <div className="col-span-2 text-center py-2 font-semibold">22/23 Season</div>
                                <div>
                                  <label
                                    htmlFor="dollars_per_hectare1"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Dollars per Hectare
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="dollars_per_hectare1"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="cents_per_pound1"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Cents per Pound
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="cents_per_pound1"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>
                                <div>
                                  <label
                                    htmlFor="dollars_per_hectare2"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Dollars per Hectare
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="dollars_per_hectare2"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="cents_per_pound2"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Cents per Pound
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="cents_per_pound2"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>
                                <div>
                                  <label
                                    htmlFor="dollars_per_hectare3"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Dollars per Hectare
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="dollars_per_hectare3"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="cents_per_pound3"
                                    className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                  >
                                    Cents per Pound
                                  </label>
                                  <input
                                    type="number"
                                    step=".01"
                                    id="cents_per_pound3"
                                    required
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your estimate"
                                  />
                                </div>
                                <div className="col-span-2 flex justify-center pt-4">
                                  {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                                  <FormSubmit errorMessage={costError_Message} warningMessage={costWarning_Message} submitted={costSubmitted} submitting={costSubmitting} warningSubmit={costWarningSubmit} />
                                </div>
                              </form>
                            </div>
                          </div>
                          <div onClick={() => setOpenCostForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1">
                    <div>
                      <div className="mt-6 -mb-2 font-semibold text-center">Commercialisation {selectedSeason}</div>
                      <div className="mb-16 w-full">

                        <LineGraph data={getEstimatesData(JSON.parse(commercialisationData).filter((estimate) => estimate.season === selectedSeason), ['percentage_sold'], ['Percentage'])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Percentage Sold" />
                      </div>
                    </div>
                    {/* <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Cents per Pound {selectedSeason}</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == selectedSeason), ["cost_estimate_cent_per_pound"], [""])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                  </div>
                </div> */}
                  </div>
                  <div className="grid place-content-center">
                    <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenCommercialisationForm(true)}>Update your Commercialisation</div>
                    {openCommercialisationForm && (
                      <div className='absolute text-black modal left-0 top-0 z-40'>
                        <div className=' fixed grid place-content-center inset-0 z-40'>
                          <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                            <div className="my-4 text-black font-semibold text-lg">
                              Update your commercialisation
                            </div>
                            <div className="w-full">
                              <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleCommercialisationFormSubmit}>
                                <div className=" text-center py-2 font-semibold">22/23 Season</div>

                                <label
                                  htmlFor="percentage1"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                >
                                  Percentage Sold
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="percentage1"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />

                                <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>

                                <label
                                  htmlFor="percentage2"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                >
                                  Percentage Sold
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="percentage2"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />

                                <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>

                                <label
                                  htmlFor="percentage3"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                >
                                  Percentage Sold
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="percentage3"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />

                                <div className="col-span-2 flex justify-center pt-4">
                                  {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                                  <FormSubmit errorMessage={commercialisationError_Message} warningMessage={commercialisationWarning_Message} submitted={commercialisationSubmitted} submitting={commercialisationSubmitting} warningSubmit={commercialisationWarningSubmit} />
                                </div>
                              </form>
                            </div>
                          </div>
                          <div onClick={() => setOpenCommercialisationForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="text-lg font-semibold text-center mb-4">Unfixed Cotton</div>
              <div className="w-full">
                <table className="border border-black w-full">
                  <thead className="text-left border-b border-black">
                    <tr className="">
                      <th className="px-4">Contract</th>
                      <th className="px-4">Futures Month</th>
                      <th className="px-4">Fix By</th>
                      <th className="px-4">Basis</th>
                      <th className="px-4">Percentage Fixed</th>
                      <th className="px-4">Amount Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {JSON.parse(unfixedData).map((row) => (
                      <tr className="" key={row.record_id}>
                        <td className="px-4">{row.contract_number}</td>
                        <td className="px-4">{row.futures_month}</td>
                        <td className="px-4">{row.fix_by.split('T')[0]}</td>
                        <td className="px-4">{row.basis}</td>
                        <td className="px-4">{(100 - (parseFloat(row.amount_remaining) / parseFloat(row.total_amount) * 100)) ?? 0}</td>
                        <td className="px-4">{row.amount_remaining}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {JSON.parse(fixedData).length === 0 && (
                <div className="text-center w-full py-4">currently no unfixed cotton records</div>
              )}
              <div className="grid place-content-center">
                <div className="bg-deep_blue text-white rounded-lg px-4 py-1 mt-4 mb-4 cursor-pointer" onClick={() => setOpenUnfixedForm(true)}>Add Unfixed Cotton</div>
                {openUnfixedForm && (
                  <div className='absolute text-black modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 text-black font-semibold text-lg">
                          Add Unfixed Cotton Record
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleUnfixedFormSubmit}>
                            <div className="flex items-center">
                              <label
                                htmlFor="partially_fixed"
                                className="text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                              >
                                Is this contract partially fixed?
                              </label>
                              <input
                                type="checkbox"
                                id="partially_fixed"
                                onChange={(e) => setPartiallyFixed(e.target.checked)}
                                className="w-fit -mb-1 ml-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter contract name"
                              />
                            </div>

                            <div className="flex gap-x-4">
                              <div className="w-full">
                                <label
                                  htmlFor="contract"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Contract
                                </label>
                                <input
                                  type="text"
                                  id="contract"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter contract name"
                                />
                              </div>

                              <div className="w-full">
                                <label
                                  htmlFor="futures_month"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Futures Month
                                </label>
                                <input
                                  type="text"
                                  id="futures_month"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter future month"
                                />
                              </div>
                            </div>
                            <div className="flex gap-x-4">
                              <div className="w-full">
                                <label
                                  htmlFor="fix_by"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Fix By
                                </label>
                                <input
                                  type="date"
                                  id="fix_by"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />
                              </div>
                              <div className="w-full">
                                <label
                                  htmlFor="basis"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Basis
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="basis"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter basis value"
                                />
                              </div>
                            </div>
                            {partiallyFixed && (
                              <>
                                <div className="flex gap-x-4">
                                  <div className="w-full">
                                    <label
                                      htmlFor="percentage"
                                      className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                    >
                                      Percentage Fixed
                                    </label>
                                    <input
                                      type="number"
                                      step=".01"
                                      id="percentage"
                                      required
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                      placeholder="Enter percentage fixed"
                                    />
                                  </div>
                                  <div className="w-full">
                                    <label
                                      htmlFor="fixed_price"
                                      className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                    >
                                      Average Fixed Price Without Basis
                                    </label>
                                    <input
                                      type="number"
                                      step=".01"
                                      id="fixed_price"
                                      required
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                      placeholder="Enter fixed price"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="flex gap-x-4">
                              {/* <div className="w-full">
                                <label
                                  htmlFor="percentage"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                  >
                                  Percentage Fixed
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="percentage"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter percentage fixed"
                                  />
                              </div> */}
                              <div className="w-full">
                                <label
                                  htmlFor="remaining"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Amount{partiallyFixed ? ' Remaining' : ''}&nbsp;(tonnes)
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="remaining"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder={`Enter amount${partiallyFixed ? ' remaining' : ''}`}
                                />
                              </div>
                            </div>
                            <div className="col-span-2 flex justify-center pt-4">
                              {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                              <FormSubmit errorMessage={unfixedError_Message} warningMessage={unfixedWarning_Message} submitted={unfixedSubmitted} submitting={unfixedSubmitting} warningSubmit={unfixedWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => { setPartiallyFixed(false); setOpenUnfixedForm(false) }} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="text-lg font-semibold text-center mb-4">Fixed Cotton</div>
              <table className="border border-black">
                <thead className="text-left border-b border-black">
                  <tr className="">
                    <th className="px-4">Contract</th>
                    <th className="px-4">Futures Month</th>
                    <th className="px-4">Basis</th>
                    <th className="px-4">Average Fixed Without Basis</th>
                    <th className="px-4">Average Total Fixed Price</th>
                    <th className="px-4">Amount Fixed</th>
                  </tr>
                </thead>
                <tbody className="">
                  {JSON.parse(fixedData).map((row) => (
                    <tr className="" key={row.record_id}>
                      <td className="px-4">{row.contract_number}</td>
                      <td className="px-4">{row.futures_month}</td>
                      <td className="px-4">{row.basis}</td>
                      <td className="px-4">{row.fixed_price_without_basis}</td>
                      <td className="px-4">{parseFloat(row.fixed_price_without_basis) + parseFloat(row.basis) / 100}</td>
                      <td className="px-4">{row.amount_fixed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {JSON.parse(fixedData).length == 0 && (
                <div className="text-center w-full py-4">currently no fixed cotton records</div>
              )}
              <div className="grid place-content-center">
                <div className="bg-deep_blue text-white rounded-lg px-4 py-1 mt-4 mb-4 cursor-pointer" onClick={() => setOpenFixedForm(true)}>Add Fixed Cotton</div>
                {openFixedForm && (
                  <div className='absolute text-black modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 text-black font-semibold text-lg">
                          Add Fixed Cotton Record
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleFixedFormSubmit}>
                            {/* {modifyingExistingContract ? "true" : "false"} */}
                            <div className="flex items-center">
                              <label
                                htmlFor="existing"
                                className="text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                              >
                                Add from an existing unfixed contract
                              </label>
                              <input
                                type="checkbox"
                                id="existing"
                                onChange={(e) => setModifyingExistingContract(e.target.checked)}
                                className="w-fit -mb-1 ml-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter contract name"
                              />
                            </div>
                            {modifyingExistingContract && (
                              <>
                                <SingleSelectDropdown
                                  options={JSON.parse(unfixedData).map((data) => { const object = { name: data.contract_number, parameter: data.contract_number, ...data }; return object })}
                                  label="Contract"
                                  variable="name"
                                  colour="bg-deep_blue"
                                  onSelectionChange={(e) => setModifyingContract(e)}
                                  placeholder="Select Contract"
                                  searchPlaceholder="Search Contract"
                                  includeLabel={false}
                                />
                              </>
                            )}
                            {!modifyingExistingContract && (
                              <>
                                <div className="flex gap-x-4">
                                  <div className="w-full">
                                    <label
                                      htmlFor="contract"
                                      className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                    >
                                      Contract
                                    </label>
                                    <input
                                      type="text"
                                      id="contract"
                                      required
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                      placeholder="Enter contract name"
                                    />
                                  </div>

                                  <div className="w-full">
                                    <label
                                      htmlFor="futures_month"
                                      className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                    >
                                      Futures Month
                                    </label>
                                    <input
                                      type="text"
                                      id="futures_month"
                                      required
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                      placeholder="Enter future month"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-x-4">
                                  {/* <div className="w-full">
                                                      <label
                                                        htmlFor="fix_by"
                                                        className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                                      >
                                                        Fix By
                                                      </label>
                                                      <input
                                                        type="date"
                                                        id="fix_by"
                                                        required
                                                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                                        placeholder="Enter your estimate"
                                                      />
                                                    </div> */}
                                  <div className="w-full">
                                    <label
                                      htmlFor="basis"
                                      className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                    >
                                      Basis
                                    </label>
                                    <input
                                      type="number"
                                      step=".01"
                                      id="basis"
                                      required
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                      placeholder="Enter basis value"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="flex gap-x-4">
                              <div className="w-full">
                                <label
                                  htmlFor="price"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Fixed Price Without Basis
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="price"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter price"
                                />
                              </div>
                              <div className="w-full">
                                <label
                                  htmlFor="amount"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3 mt-3"
                                >
                                  Amount Fixed (Tonnes)
                                </label>
                                <input
                                  type="number"
                                  step=".01"
                                  id="amount"
                                  required
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter amount fixed"
                                />
                              </div>
                            </div>
                            <div className="col-span-2 flex justify-center pt-4">
                              {/* <button
                                              type="submit"
                                              className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                                            >
                                              Submit
                                            </button> */}
                              <FormSubmit errorMessage={fixedError_Message} warningMessage={fixedWarning_Message} submitted={fixedSubmitted} submitting={fixedSubmitting} warningSubmit={fixedWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => { setModifyingExistingContract(false); setOpenFixedForm(false) }} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="text-lg font-semibold text-center mb-2">
                Strategy Log
              </div>
              <div className="flex flex-col gap-y-4">
                {JSON.parse(strategyLogData).map((strategy) => (
                  <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setStrategyPopup(strategy)}>
                    <div>
                      {strategy?.title}
                    </div>
                    <div>
                      {parseDateString(strategy?.date_created)}
                    </div>
                  </div>
                ))}
              </div>
              {strategyPopup != null && (
                <div className='absolute modal left-0 top-0 z-40'>
                  <div className=' fixed grid place-content-center inset-0 z-40'>
                    <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                      {/* <img className="w-3/4" src={strategyPopup.image_of_in_country_news} /> */}
                      <div className="my-4 font-semibold text-lg">
                        {strategyPopup.title}
                      </div>
                      <div className="-mt-4 mb-2">
                        {parseDateString(strategyPopup.date_created)}
                      </div>
                      <div className="">
                        {/* <ReactMarkdown children={strategyPopup.text_of_in_country_news} /> */}
                        {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                        {/* {(strategyPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                        {strategyPopup.text.split('[newline]').map((paragraph, index) => (
                          <>
                            <p>{paragraph}</p>
                            {index != strategyPopup.text.split('[newline]').length - 1 && (
                              <>
                                <br />
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                    <div onClick={() => setStrategyPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
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

  if (!session || (session?.type !== 'producer' && session?.type !== 'spinner' && session?.company_id !== 'cllxqmywr0000zbdg10nqp2up')) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  let company_id = session?.company_id

  if (session?.company_id === 'cllxqmywr0000zbdg10nqp2up') {
    company_id = session?.selected_company_id
  }

  const company = await prisma?.company.findFirst({
    where: {
      record_id: company_id
    },
    include: {
      macrovesta_manager: true,
      company_manager: true
    }
  })

  const companyData = JSON.stringify(company)

  const production = await prisma?.producer_production_estimates.findMany({
    where: {
      company_id
    },
    orderBy: {
      date_created: 'asc'
    }
  })

  const productionData = JSON.stringify(production)

  const cost = await prisma?.producer_cost_estimates.findMany({
    where: {
      company_id
    },
    orderBy: {
      date_created: 'asc'
    }
  })

  const costData = JSON.stringify(cost)

  const commercialisation = await prisma?.producer_commercialisation_estimates.findMany({
    where: {
      company_id
    },
    orderBy: {
      date_created: 'asc'
    }
  })

  const commercialisationData = JSON.stringify(commercialisation)

  const strategylog = await prisma?.strategy_log.findMany({
    where: {
      company_id
    }
  })

  const strategyLogData = JSON.stringify(strategylog)

  const today = new Date() // Current date
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const fixed = await prisma?.fixed_cotton.findMany({
    where: {
      company_id
    }
  })

  const fixedData = JSON.stringify(fixed)

  const unfixed = await prisma?.unfixed_cotton.findMany({
    where: {
      company_id
    }
  })

  const unfixedData = JSON.stringify(unfixed)

  const premiumCompany = await prisma?.company.findMany({
    where: {
      tier: 'premium'
    }
  })

  const premiumCompaniesData = JSON.stringify(premiumCompany)

  // console.log(monthlyIndexData)
  return {
    props: { companyData, productionData, costData, commercialisationData, strategyLogData, fixedData, unfixedData, premiumCompaniesData }
  }
}

export default Home
