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
import MonthlyIndex from '~/components/MonthlyIndex'
import {
  getCottonOnCallWeekData,
  getCottonOnCallSeasonData,
  getCommitmentOfTradersWeekData,
  getCommitmentOfTradersSeasonData,
  getSupplyAndDemandData,
  getUSExportSalesData,
  getUSExportSalesWeekData,
  getUSExportSalesSeasonData,
  getSeasonData,
  getStudyData
} from '../utils/getDataUtils'
import { calculateSpread, transformData, basisBarChartData, averageFutureContract, averageMarketSentiment, groupAndStringifyContracts, formatAndStringifyBasisData, transformSurveyData } from '../utils/calculateUtils'
import { getCurrentMonth, parseDateString, getWeekNumber, addFullYear, getWeek, oneWeekAgo } from '../utils/dateUtils'
import SeasonalIndex from '~/components/SeasonalIndex'
import LatestMarketReport from '~/components/LatestMarketReport'
import CTZ23 from '~/components/CTZ23'
import DomesticPrices from '~/components/DomesticPrices'
import WeeklySentimentSurvey from '~/components/WeeklySentimentSurvey'
import RecentEvents from '~/components/RecentEvents'
import BasisCosts from '~/components/BasisCosts'
import USExportSales from '~/components/USExportSales'
import FutureConsiderations from '~/components/FutureConsiderations'

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: 'AAPL',
  interval: '1D' as ResolutionString,
  library_path: '/static/charting_library/',
  locale: 'en',
  charts_storage_url: 'https://saveload.tradingview.com',
  charts_storage_api_version: '1.1',
  client_id: 'tradingview.com',
  user_id: 'public_user_id',
  fullscreen: false,
  autosize: true
}

const selectAppropriateImage = (inv, value) => {
  let imagesrc = ''
  if (inv == 'Y') {
    if (value < 15) {
      imagesrc = '/Index_Neutral.jpg'
    } else if (value < 50) {
      imagesrc = '/Index_Inverse_Likely.jpg'
    } else {
      imagesrc = '/Index_Inverse_High.jpg'
    }
  } else {
    if (value < 15) {
      imagesrc = '/Index_Neutral.jpg'
    } else if (value < 50) {
      imagesrc = '/Index_Non_Likely.jpg'
    } else {
      imagesrc = '/Index_Non_High.jpg'
    }
  }
  return (
    <img className="w-[400px]" src={imagesrc} />
  )
}

const renderers = {
  h1: ({ node, ...props }) => <h1 {...props} />,
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  h4: ({ node, ...props }) => <h4 {...props} />,
  h5: ({ node, ...props }) => <h5 {...props} />,
  h6: ({ node, ...props }) => <h6 {...props} />
}
// TODO: Use <Image></Image> from next instead <img> - Better performance.

const Home: NextPage = ({ monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, contractData, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData, aIndexData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()
  console.log('session', session)
  console.log('session.submittedSurvey', session?.submittedSurvey)

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

  const [degrees, setDegrees] = React.useState(90)

  const [season1, setSeason1] = React.useState('')
  const [season2, setSeason2] = React.useState('')
  const [season3, setSeason3] = React.useState('')

  const [contract1, setContract1] = React.useState('')
  const [contract2, setContract2] = React.useState('')
  const [contract3, setContract3] = React.useState('')

  const [countryNewsPopup, setCountryNewsPopup] = React.useState(null)


  React.useEffect(() => {
    setSeason1(JSON.parse(seasonsData)[2]?.season ?? '')
    setSeason2(JSON.parse(seasonsData)[1]?.season ?? '')
    setSeason3(JSON.parse(seasonsData)[0]?.season ?? '')
    // setContract1(JSON.parse(seasonsData)[2]?.season ?? '')
    // setContract2(JSON.parse(seasonsData)[1]?.season ?? '')
    // setContract3(JSON.parse(seasonsData)[0]?.season ?? '')
  }, [seasonsData])

  React.useEffect(() => {
    setContract1(JSON.parse(futureContractsStudyData)[2]?.year ?? '')
    setContract2(JSON.parse(futureContractsStudyData)[1]?.year ?? '')
    setContract3(JSON.parse(futureContractsStudyData)[0]?.year ?? '')
  }, [futureContractsStudyData])

  React.useEffect(() => {
    setDegrees(90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month == 'Y' ? 1 : -1))
  }, [monthlyIndexData])

  const data = [
    { country: 'Brazil', CTZ23: 10, CTZ24: 20 },
    { country: 'USA', CTZ23: 30, CTZ24: 40 },
    { country: 'WAF', CTZ23: 20, CTZ24: 40 },
    { country: 'Australia', CTZ23: 30, CTZ24: 50 }
    // ...
  ]

  const linedata = [
    {
      name: 'Series 1',
      data: [
        { time: '2023-01-01T00:00:00Z', value: 12 },
        { time: '2023-01-08T00:00:00Z', value: 12 },
        { time: '2023-02-01T00:00:00Z', value: 22 },
        { time: '2023-02-08T00:00:00Z', value: 22 },
        { time: '2023-03-01T00:00:00Z', value: 21 },
        { time: '2023-04-01T00:00:00Z', value: 23 },
        { time: '2025-01-01T00:00:00Z', value: 26 }
        // more data...
      ]
    },
    {
      name: 'Series 2',
      data: [
        { time: '2023-01-01T00:00:00Z', value: 15 },
        { time: '2023-01-08T00:00:00Z', value: 15 },
        { time: '2023-02-01T00:00:00Z', value: 18 },
        { time: '2023-02-08T00:00:00Z', value: 18 },
        { time: '2023-03-01T00:00:00Z', value: 11 },
        { time: '2023-04-01T00:00:00Z', value: 13 },
        { time: '2025-01-01T00:00:00Z', value: 16 }
        // more data...
      ]
    }
    // more series...
  ]

  const [openBasisCostForm, setOpenBasisCostForm] = React.useState(false)
  const [openSnapshotForm, setOpenSnapshotForm] = React.useState(false)
  const [openCountryNewsForm, setOpenCountryNewsForm] = React.useState(false)

  const [selectedCountry, setSelectedCountry] = React.useState(undefined)
  const [selectedFormCostType, setSelectedFormCostType] = React.useState(undefined)

  const [bullishBearish, setBullishBearish] = React.useState(undefined)

  const handleBasisFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSubmitting(true)

    let country = ''
    let cost_type = ''
    const contractOneBasis = e.target.ctz23.value
    const contractTwoBasis = e.target.ctz24.value
    let errorMessage = ''
    const warningMessage = ''

    if (selectedCountry != null && selectedCountry != 'Select Country') {
      country = selectedCountry
    } else {
      errorMessage += 'Please select a Country. '
    }

    if (selectedFormCostType != null && selectedFormCostType != 'Select cost type') {
      cost_type = selectedFormCostType
    } else {
      errorMessage += 'Please select a cost type. '
    }

    if (contractOneBasis == null || contractOneBasis == '') {
      errorMessage += 'Please enter Estimate for CTZ23. '
    }
    if (contractTwoBasis == null || contractTwoBasis == '') {
      errorMessage += 'Please enter Estimate for CTZ24. '
    }

    if (warningMessage !== '') {
      setWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (warning_Message != '') {
        setWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setError_Message(errorMessage)
      setWarningSubmit(false)
      setSubmitting(false)
    } else {
      if (error_Message != '') {
        setError_Message('')
      }

      if (warningSubmit == false && warningMessage != '') {
        setWarningSubmit(true)
        setSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          country,
          contractOneBasis,
          contractTwoBasis,
          user: session?.user?.name,
          cost_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-basis-cost-estimate'

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
        const result = await response.json().then(() => { setSubmitted(true); setSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  const handleCountryNewsFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setCountryNewsSubmitting(true)

    const country = countryNewsFormCountry
    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value
    let errorMessage = ''
    let warningMessage = ''

    // console.log("textarea", text == "")

    if (country == null || country == '') {
      errorMessage += 'Please select a country. '
    }
    if (title == null || title == '') {
      errorMessage += 'Please enter a title. '
    }
    if (text == null || text == '') {
      errorMessage += 'Please enter a text. '
    }
    if (image == null || image == '') {
      warningMessage += "You can add an image as well. If you don't want to just click confirm. "
    }

    if (warningMessage !== '') {
      setCountryNewsWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (countryNewsWarning_Message != '') {
        setCountryNewsWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setCountryNewsError_Message(errorMessage)
      setCountryNewsWarningSubmit(false)
      setCountryNewsSubmitting(false)
    } else {
      if (countryNewsError_Message != '') {
        setCountryNewsError_Message('')
      }

      if (countryNewsWarningSubmit == false && warningMessage != '') {
        setCountryNewsWarningSubmit(true)
        setCountryNewsSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          country,
          title,
          text,
          image,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-country-news'

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
        const result = await response.json().then(() => { setCountryNewsSubmitted(true); setCountryNewsSubmitting(false) })
        // setCountryNewsSubmitted(true); setCountryNewsSubmitting(false)
      }
    }
  }
  const [countryNewsError_Message, setCountryNewsError_Message] = React.useState('')
  const [countryNewsSubmitted, setCountryNewsSubmitted] = React.useState(false)
  const [countryNewsSubmitting, setCountryNewsSubmitting] = React.useState(false)
  const [countryNewsWarning_Message, setCountryNewsWarning_Message] = React.useState('')
  const [countryNewsWarningSubmit, setCountryNewsWarningSubmit] = React.useState(false)

  const [error_Message, setError_Message] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [warning_Message, setWarning_Message] = React.useState('')
  const [warningSubmit, setWarningSubmit] = React.useState(false)

  interface CountryData {
    country: string;
    CTZ23: number;
    CTZ24: number;
  }

  type formattedBasis = {
    country: string;
    date_of_basis_report: string;
    CTZ23: number;
    CTZ24: number;
  }[]

  // function transformData(input) {
  //   // Create a container for the new data structure
  //   let output = {};
  //   const start_day = 1

  //   // Container to keep track of the sum and count for each contract and week
  //   let averages = {};

  //   // Iterate over the input data
  //   for (let item of input) {
  //     // For each contract date, add data to the output
  //     for (let key of Object.keys(item)) {
  //       if (key.startsWith("CTZ")) {
  //         let contractName = `${item.country} CTZ${key.slice(-2)}`;

  //         // If this contract name hasn't been added to the output yet, initialize it
  //         if (!output[contractName]) {
  //           output[contractName] = [];
  //           averages[contractName] = {};
  //         }

  //         let date = new Date(item.date_of_basis_report);
  //         let week = getWeek(date, start_day);
  //         // let week = getWeek(date, start_day);

  //         // If this week hasn't been added to the averages for this contract yet, initialize it
  //         if (!averages[contractName][week]) {
  //           averages[contractName][week] = { sum: 0, count: 0 };
  //         }

  //         // Add the data point to the averages
  //         averages[contractName][week].sum += item[key];
  //         averages[contractName][week].count++;
  //       }
  //     }
  //   }

  //   // Convert the averages to actual averages and add them to the output
  //   for (let contractName of Object.keys(averages)) {
  //     for (let week of Object.keys(averages[contractName])) {
  //       let average = parseFloat((averages[contractName][week].sum / averages[contractName][week].count).toFixed(0));
  //       // Assume the first day of the week (Monday) for the time
  //       let date = new Date(new Date().getFullYear(), 0, 1 + (week - 1) * 7);
  //       output[contractName].push({ time: date.toISOString(), value: average });
  //     }
  //   }

  //   // Convert the output object to an array
  //   output = Object.keys(output).map(name => {
  //     return { name: name, data: output[name] };
  //   });

  //   return output;
  // }

  // function transformSurveyData(inputArray, propertyUsed) {
  //   const outputArray = [];

  //   // Group the objects based on bullish_or_bearish property
  //   const groups = inputArray.reduce((result, obj) => {
  //     const key = obj.bullish_or_bearish;
  //     if (!result[key]) {
  //       result[key] = [];
  //     }
  //     result[key].push(obj);
  //     return result;
  //   }, {});

  //   // Convert each group into the desired format
  //   for (const groupName in groups) {
  //     const group = groups[groupName];
  //     const data = group.map(obj => {
  //       return {
  //         time: obj.date_of_survey,
  //         value: parseFloat(obj[propertyUsed])
  //       };
  //     });

  //     outputArray.push({
  //       name: groupName,
  //       data: data
  //     });
  //   }

  //   return outputArray;
  // }

  // function transformSurveyData(inputArray, propertyUsed) {
  //   const outputArray = [];
  //   const averages = {};

  //   for (const obj of inputArray) {
  //     const groupName = obj.bullish_or_bearish;

  //     if (!averages[groupName]) {
  //       averages[groupName] = {};
  //     }

  //     const date = new Date(obj.date_of_survey);
  //     const dateString = date.toISOString().split("T")[0];

  //     if (!averages[groupName][dateString]) {
  //       averages[groupName][dateString] = {
  //         sum: 0,
  //         count: 0
  //       };
  //     }

  //     averages[groupName][dateString].sum += parseFloat(obj[propertyUsed]);
  //     averages[groupName][dateString].count++;
  //   }

  //   for (const groupName in averages) {
  //     const group = averages[groupName];
  //     const data = [];

  //     for (const dateString in group) {
  //       const average =
  //         group[dateString].sum / group[dateString].count;
  //       const date = new Date(dateString);

  //       data.push({
  //         time: date.toISOString(),
  //         value: average
  //       });
  //     }

  //     outputArray.push({
  //       name: groupName,
  //       data: data
  //     });
  //   }

  //   return outputArray;
  // }

  // const getCottonOnCallWeekData = (data, salesOrPurchases) => {
  //   let october = { name: "october", data: [], noCircles: true }
  //   let december = { name: "december", data: [], noCircles: true }
  //   let march = { name: "march", data: [], noCircles: true }
  //   let may = { name: "may", data: [], noCircles: true }
  //   let july = { name: "july", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     october.data.push({ x: parseInt(item.week), y: parseInt(item[`october_${salesOrPurchases}`]) })
  //     december.data.push({ x: parseInt(item.week), y: parseInt(item[`december_${salesOrPurchases}`]) })
  //     march.data.push({ x: parseInt(item.week), y: parseInt(item[`march_${salesOrPurchases}`]) })
  //     may.data.push({ x: parseInt(item.week), y: parseInt(item[`may_${salesOrPurchases}`]) })
  //     july.data.push({ x: parseInt(item.week), y: parseInt(item[`july_${salesOrPurchases}`]) })
  //   })
  //   return [october, december, march, may, july]
  // }

  // const getCommitmentOfTradersWeekData = (data) => {
  //   let producer_merchant_net = { name: "Producer Merchant Net", data: [], noCircles: true }
  //   let open_interest_all = { name: "Open Interest All", data: [], noCircles: true }
  //   let swap_position_net = { name: "Swap Position Net", data: [], noCircles: true }
  //   let managed_money_net = { name: "Managed Money Net", data: [], noCircles: true }
  //   let other_reportables_net = { name: "Other Reportables Net", data: [], noCircles: true }
  //   let total_reportables_net = { name: "Total Reportables Net", data: [], noCircles: true }
  //   let non_reportables_net = { name: "Non Reportables Net", data: [], noCircles: true }
  //   let specs_net = { name: "Specs Net", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     producer_merchant_net.data.push({ x: parseInt(item.week), y: parseInt(item.producer_merchant_net) })
  //     open_interest_all.data.push({ x: parseInt(item.week), y: parseInt(item.open_interest_all) })
  //     swap_position_net.data.push({ x: parseInt(item.week), y: parseInt(item.swap_position_net) })
  //     managed_money_net.data.push({ x: parseInt(item.week), y: parseInt(item.managed_money_net) })
  //     other_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.other_reportables_net) })
  //     total_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.total_reportables_net) })
  //     non_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.non_reportables_net) })
  //     specs_net.data.push({ x: parseInt(item.week), y: parseInt(item.specs_net) })
  //   })
  //   console.log("product_merchant_net", producer_merchant_net)
  //   return [producer_merchant_net, open_interest_all, swap_position_net, managed_money_net, other_reportables_net, total_reportables_net, non_reportables_net, specs_net]
  // }
  // const getCommitmentOfTradersSeasonData = (data) => {
  //   let producer_merchant_net = { name: "Producer Merchant Net", data: [], noCircles: true }
  //   let open_interest_all = { name: "Open Interest All", data: [], noCircles: true }
  //   let swap_position_net = { name: "Swap Position Net", data: [], noCircles: true }
  //   let managed_money_net = { name: "Managed Money Net", data: [], noCircles: true }
  //   let other_reportables_net = { name: "Other Reportables Net", data: [], noCircles: true }
  //   let total_reportables_net = { name: "Total Reportables Net", data: [], noCircles: true }
  //   let non_reportables_net = { name: "Non Reportables Net", data: [], noCircles: true }
  //   let specs_net = { name: "Specs Net", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     producer_merchant_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.producer_merchant_net) })
  //     open_interest_all.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.open_interest_all) })
  //     swap_position_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.swap_position_net) })
  //     managed_money_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.managed_money_net) })
  //     other_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.other_reportables_net) })
  //     total_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.total_reportables_net) })
  //     non_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.non_reportables_net) })
  //     specs_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.specs_net) })
  //   })
  //   console.log("product_merchant_net", producer_merchant_net)
  //   return [producer_merchant_net, open_interest_all, swap_position_net, managed_money_net, other_reportables_net, total_reportables_net, non_reportables_net, specs_net]
  // }

  console.log('Basis Data', JSON.parse(basisData).filter((basis) => basis.country == 'Brazil'))
  console.log('Line Data', transformData(JSON.parse(basisData).filter((basis) => basis.country == 'Brazil')))
  console.log('basis', JSON.parse(basisData))

  const [basisCountry, setBasisCountry] = React.useState('Brazil')

  const [WeekOrYear, setWeekOrYear] = React.useState('Year')
  const [Year, setYear] = React.useState('2324')
  const [Week, setWeek] = React.useState(1)

  const [salesWeekOrYear, setSalesWeekOrYear] = React.useState('Week')
  const [salesYear, setSalesYear] = React.useState('0102')
  const [salesWeek, setSalesWeek] = React.useState(1)

  const [purchasesWeekOrYear, setPurchasesWeekOrYear] = React.useState('Week')
  const [purchasesYear, setPurchasesYear] = React.useState('0102')
  const [purchasesWeek, setPurchasesWeek] = React.useState(1)

  const [totalOnCallWeekOrYear, setTotalOnCallWeekOrYear] = React.useState('Week')
  const [totalOnCallYear, setTotalOnCallYear] = React.useState('0102')
  const [totalOnCallWeek, setTotalOnCallWeek] = React.useState(1)

  const [UOCWeekOrYear, setUOCWeekOrYear] = React.useState('Week')
  const [UOCYear, setUOCYear] = React.useState('0102')
  const [UOCWeek, setUOCWeek] = React.useState(1)

  const [commitmentWeekOrYear, setCommitmentWeekOrYear] = React.useState('Year')
  const [commitmentYear, setCommitmentYear] = React.useState(2023)
  const [commitmentWeek, setCommitmentWeek] = React.useState(1)

  const [exportSalesWeekOrYear, setExportSalesWeekOrYear] = React.useState('Week')
  const [exportSalesYear, setExportSalesYear] = React.useState(2010)
  const [exportSalesWeek, setExportSalesWeek] = React.useState(1)

  const locale = useLocale()

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const formatter = new Intl.DateTimeFormat(locale, options)

  // Get today - Already in dateUtils.js
  const temp = new Date()
  temp.setSeconds(0)
  const dd = String(temp.getDate()).padStart(2, '0')
  const mm = String(temp.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = temp.getFullYear()

  const today = `${yyyy}-${mm}-${dd}`
  // ---------------------------------

  const temp2 = new Date() // get the current date
  temp2.setMonth(temp2.getMonth() - 6) // subtract 6 months

  // format the date as yyyy-mm-dd
  const year = temp2.getFullYear()
  let month = (temp2.getMonth() + 1).toString() // JavaScript months are 0-based, so we add 1
  let day = (temp2.getDate()).toString()

  // ensure month and day are 2 digits
  if (parseInt(month) < 10) {
    month = '0' + month
  }
  if (parseInt(day) < 10) {
    day = '0' + day
  }

  const dateSixMonthsAgo = `${year}-${month}-${day}`
  const [selectedStartDate, setSelectedStartDate] = React.useState(parseDate(dateSixMonthsAgo))
  const [selectedEndDate, setSelectedEndDate] = React.useState(parseDate(today))

  // const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = React.useState(parseDate(dateSixMonthsAgo));
  // const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = React.useState(parseDate(today));
  const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = React.useState(new Date('2000-01-01').toISOString())
  const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = React.useState(new Date('2023-12-31').toISOString())
  const [selectedSupplyAndDemandSeason, setSelectedSupplyAndDemandSeason] = React.useState('20/21')

  // const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(["open_interest_all", "producer_merchant_net", "swap_position_net", "managed_money_net", "other_reportables_net", "total_reportables_net", "non_reportables_net", "specs_net"])
  // const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(["Open Interest All", "Producer Merchant Net", "Swap Position Net", "Managed Money Net", "Other Reportables Net", "Total Reportables Net", "Non Reportables Net", "Specs Net"])
  const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(['specs_net'])
  const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(['Specs Net'])

  const [exportPropertiesArray, setExportPropertiesArray] = React.useState(['net_sales', 'next_marketing_year_net_sales'])
  const [exportNamesArray, setExportNamesArray] = React.useState(['Net Sales', 'Next Marketing Year Net Sales'])

  const [cottonSalesPropertiesArray, setCottonSalesPropertiesArray] = React.useState(['october_sales', 'december_sales', 'march_sales', 'may_sales', 'july_sales'])
  const [cottonPurchasesPropertiesArray, setCottonPurchasesPropertiesArray] = React.useState(['october_purchases', 'december_purchases', 'march_purchases', 'may_purchases', 'july_purchases'])
  const [cottonNamesArray, setCottonNamesArray] = React.useState(['October', 'December', 'March', 'May', 'July'])

  const [supplyAndDemandPropertiesArray, setSupplyAndDemandPropertiesArray] = React.useState(['production_usda'])
  const [supplyAndDemandNamesArray, setSupplyAndDemandNamesArray] = React.useState(['Production USDA'])
  const [supplyAndDemandProjectedPropertiesArray, setSupplyAndDemandProjectedPropertiesArray] = React.useState(['production_usda', 'production_eap'])
  const [supplyAndDemandProjectedNamesArray, setSupplyAndDemandProjectedNamesArray] = React.useState(['Production USDA', 'Production EAP'])

  const [currentStage, setCurrentStage] = React.useState(0)

  const getUniqueOptions = (data, property) => {
    const uniqueValues = data.reduce((acc, obj) => {
      return acc.includes(obj[property]) ? acc : [...acc, obj[property]]
    }, [])
    const options = []
    uniqueValues.forEach((value) => {
      options.push({ value: String(value) })
    })
    return options.sort((a, b) => a.value - b.value)
  }

  const goNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1)
    }
  }

  const goPrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1)
    }
  }

  const stages = [1, 2]

  const markdown = `# Ira media medius induit deum

  ## Exaudire enim ad sit
  
  Lorem markdownum colores, se gravatum flet vulnera: dum in, onusque parvumque geminata quoque. Expositum valentes nobis capax opes rapidas quas. Iudicis miserande prius ea iubet cupidine? Inde sua amo latis amantis: Hiberis sinus fervet fecit ex ullis circumfluit furor turbida, mox inque, infera? Nec lumina maneret: patrios etiamnum modum et modo generum quamvis in verbis, si, hic rerum.
  
  > Inhibente proceresque morata paelice, precor veri; umeris Tereu sic constitit in harenosae ut diva est, hoc. Cruore cremat, quam cornua verba. In forte defluit valuisse gaudens faciem: luctisono et vulnere, tuo ordine navigii. Agenore fuso sidera; sacra exit: est modo, ibi saxa aetate domitis enim.
  
  ## Protinus clara
  
  Rhoetus arcusque; in coma nosti fratrem ipse abstulerat fassurae satyri: nil dextra corripitur saetae, expositum sententia scelus. Latentia sua progenuit nam enim lyramque amori post, Ilithyiam datis per vestris ferrugine quorum, admirantibus. Novos iter ut: ego omnes, campis memini.
  
  `

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

  const [selectedCostType, setSelectedCostType] = React.useState('FOB')

  const [clientCottonContractsData, setClientCottonContractsData] = React.useState({ ctz23: [], cth24: [], ctk24: [], ctn24: [], ctz24: [] })

  const [clientUSExportSalesData, setClientUSExportSalesData] = React.useState([])
  const [clientCottonOnCallData, setClientCottonOnCallData] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using the fetch method
        const response = await fetch('/api/get-us-export-sales-data')

        // Check if the request was successful
        if (response.ok) {
          // Parse the JSON data from the response
          const result = await response.json()

          // Update the state with the fetched data
          setClientUSExportSalesData(result)
        } else {
          console.error(`API request failed with status ${response.status}`)
        }
      } catch (error) {
        console.error(`An error occurred while fetching data: ${error}`)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using the fetch method
        const response = await fetch('/api/get-cotton-on-call-data')

        // Check if the request was successful
        if (response.ok) {
          // Parse the JSON data from the response
          const result = await response.json()

          // Update the state with the fetched data
          setClientCottonOnCallData(result)
        } else {
          console.error(`API request failed with status ${response.status}`)
        }
      } catch (error) {
        console.error(`An error occurred while fetching data: ${error}`)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  const [countryNewsFilter, setCountryNewsFilter] = React.useState('All Countries')
  const [countryNewsFormCountry, setCountryNewsFormCountry] = React.useState('')

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name="description" content="Generated by Macrovesta" />
        <link rel="icon" href="/favicon.ico" />
        {/* <script src="/static/datafeeds/udf/dist/bundle.js" async /> */}
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
      <main className="main grid grid-cols-[160px_auto] h-screen items-center">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-20 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Macrovesta Demo'} urlPath={urlPath} user={session?.user.name} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">
            <p className='mx-8 text-justify'>
              Macrovesta is being developed to deliver AI-powered cotton market expertise from farmer to retailer. The insights delivered by your personalised dashboard will provide you with the information and context you need to make confident risk and position management decisions. Our artificial intelligence model uses cutting edge technology to generate insights and explain how and why they are important to your business.
            </p>
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">

              {/* <div>
                <LineGraph data={linedata} />
              </div> */}

              <div className="text-center font-semibold text-xl">The Macrovesta Index</div>
              <div className="flex justify-around gap-8">
                {/* <IndexDial probability={0} /> */}
                <MonthlyIndex monthlyIndexData={monthlyIndexData}></MonthlyIndex>
                <SeasonalIndex seasonalIndexData={seasonalIndexData}></SeasonalIndex>
              </div>
            </div>

            <LatestMarketReport
              currentLang={currentLang}
              conclusionData={conclusionData}
              cottonReportURLData={cottonReportURLData}
            />

            <CTZ23
              session={session}
              formatter={formatter}
              contractData={contractData}
              commentsData={commentsData}
            />

            <DomesticPrices
              session={session}
              formatter={formatter}
              commentsData={commentsData}
            />

            {/* <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <TVChartContainer {...defaultWidgetProps} />
            </div> */}

            <WeeklySentimentSurvey
              setCurrentStage={setCurrentStage}
              session={session}
              currentStage={currentStage}
              goPrevious={goPrevious}
              goNext={goNext}
              stages={stages}
              sentimentData={JSON.parse(initialSentimentData)}
            />

            <RecentEvents
              snapshotsData={snapshotsData}
              session={session}
              openSnapshotForm={openSnapshotForm}
              setOpenSnapshotForm={setOpenSnapshotForm}
            />

            <FutureConsiderations
              snapshotsData={snapshotsData}
              session={session}
              openSnapshotForm={openSnapshotForm}
              setOpenSnapshotForm={setOpenSnapshotForm}
            />

            <BasisCosts
              selectedCostType={selectedCostType}
              setSelectedCostType={setSelectedCostType}
              session={session}
              setOpenBasisCostForm={setOpenBasisCostForm}
              transformData={transformData}
              basisData={basisData}
              basisCountry={basisCountry}
              openBasisCostForm={openBasisCostForm}
              setSelectedCountry={setSelectedCountry}
              setSelectedFormCostType={setSelectedFormCostType}
              handleBasisFormSubmit={handleBasisFormSubmit}
              error_Message={error_Message}
              warning_Message={warning_Message}
              submitted={submitted}
              submitting={submitting}
              warningSubmit={warningSubmit}
              setBasisCountry={setBasisCountry}
              commentsData={commentsData}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-8">
              <USExportSales
                setSelectedStartDate={setSelectedStartDate}
                selectedStartDate={selectedStartDate}
                formatter={formatter}
                setSelectedEndDate={setSelectedEndDate}
                selectedEndDate={selectedEndDate}
                setExportPropertiesArray={setExportPropertiesArray}
                setExportNamesArray={setExportNamesArray}
                getUSExportSalesData={getUSExportSalesData}
                clientUSExportSalesData={clientUSExportSalesData}
                exportPropertiesArray={exportPropertiesArray}
                exportNamesArray={exportNamesArray}
                commentsData={commentsData}
                session={session}
              />
              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <div className="relative text-center font-semibold text-xl mb-4">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                  In Country News
                </div>
                <div className="">
                  <SingleSelectDropdown
                    options={[{ country: 'All Countries' }, { country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]}
                    label="Country"
                    variable="country"
                    colour="bg-deep_blue"
                    onSelectionChange={(e) => setCountryNewsFilter(e.country)}
                    placeholder="Select Country"
                    searchPlaceholder="Search Countries"
                    includeLabel={false}
                    defaultValue="All Countries"
                  />
                </div>
                <div className="flex flex-col justify-around items-start gap-4 mt-4">
                  {JSON.parse(countryNewsData).filter((object) => countryNewsFilter != 'Select Country' && countryNewsFilter != 'All Countries' ? object?.country == countryNewsFilter : true).filter((object: any, index: number) => index < 10).map((news, index) => (
                    // <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setCountryNewsPopup(news)}>
                    //   {news.title_of_in_country_news}
                    // </div>
                    <>
                      {index == 0 && (
                        <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4" onClick={() => setCountryNewsPopup(news)}>
                          <img className="w-[150px] h-[150px] aspect-square object-cover rounded-lg" src={news?.image_of_in_country_news != '' ? news?.image_of_in_country_news : '/macrovesta_news_default_picture.jpg'} />
                          <div className="flex flex-col w-full">
                            <div className="grid grid-cols-[auto_75px]">
                              <div className="font-semibold">
                                {news.title_of_in_country_news}
                              </div>
                              <div className="w-[75px]">
                                {parseDateString(news.date_of_in_country_news)}
                              </div>
                            </div>
                            <div className="text-sm pt-2">{news.text_of_in_country_news.length > 200 ? `${news.text_of_in_country_news.slice(0, 200)}...` : news.text_of_in_country_news}</div>
                          </div>
                        </div>
                      )}
                      {index != 0 && (
                        <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setCountryNewsPopup(news)}>
                          {news.title_of_in_country_news}
                        </div>
                      )}
                    </>
                  ))}
                  {countryNewsPopup != null && (
                    <div className='absolute modal left-0 top-0 z-40'>
                      <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                          <img className="w-3/4" src={countryNewsPopup.image_of_in_country_news} />
                          <div className="my-4 font-semibold text-lg">
                            {countryNewsPopup.title_of_in_country_news}
                          </div>
                          <div className="-mt-4 mb-2">
                            {parseDateString(countryNewsPopup.date_of_in_country_news)}
                          </div>
                          <div className="">
                            {/* <ReactMarkdown children={countryNewsPopup.text_of_in_country_news} /> */}
                            {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                            {/* {(countryNewsPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                            {countryNewsPopup.text_of_in_country_news.split('[newline]').map((paragraph, index) => (
                              <>
                                <p>{paragraph}</p>
                                {index != countryNewsPopup.text_of_in_country_news.split('[newline]').length - 1 && (
                                  <>
                                    <br />
                                  </>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                        <div onClick={() => setCountryNewsPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}

                </div>
                {(session?.role == 'partner' || session?.role == 'admin') && (
                  <div className="flex justify-center">
                    <div className="bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenCountryNewsForm(true)}>
                      Add in country news
                    </div>
                  </div>
                )}
                {openCountryNewsForm && (
                  <div className='absolute modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 font-semibold text-lg">
                          Add in country news
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleCountryNewsFormSubmit}>
                            <div className="mb-4">
                              <SingleSelectDropdown
                                options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]}
                                label="Country"
                                variable="country"
                                colour="bg-deep_blue"
                                onSelectionChange={(e) => setCountryNewsFormCountry(e.country)}
                                placeholder="Select Country"
                                searchPlaceholder="Search Countries"
                                includeLabel={false}
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="image"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Image (optional)
                              </label>
                              <input
                                type="text"
                                id="image"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter a url to an image e.g. https://picsum.photos/200"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="title"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Title
                              </label>
                              <input
                                type="text"
                                id="title"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter title"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="text"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Text
                              </label>
                              <textarea id="text" placeholder="Enter text" name="text" rows={6} cols={87} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"></textarea>
                            </div>

                            <div className="col-span-2 flex justify-center">
                              {/* <button
                                type="submit"
                                className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                              >
                                Submit
                              </button> */}
                              <FormSubmit errorMessage={countryNewsError_Message} warningMessage={countryNewsWarning_Message} submitted={countryNewsSubmitted} submitting={countryNewsSubmitting} warningSubmit={countryNewsWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => setOpenCountryNewsForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="text-xl font-semibold text-center pt-4">Future Contracts Study</div>
              <img src="/Charts_Under_Construction_Wide.png" />
              <LineGraphNotTime data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == "0102"))} graphWidth={1000} graphHeight={600} xDomain2={52} xAxisTitle="Week" />
              <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == "1"))} graphWidth={1000} graphHeight={600} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
              <LineGraphNotTime data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) == 2010))} graphWidth={1000} graphHeight={600} xDomain2={52} xAxisTitle="Week" />
              <LineGraphNotTime data={getCommitmentOfTradersSeasonData(JSON.parse(commitmentData).filter((data) => parseInt(data.week) == 1))} graphWidth={1000} graphHeight={600} xDomain1={2009} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
            </div> */}
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">

              <div className="grid grid-cols-2 gap-y-8 -mb-8">
                <div className="relative col-span-2 text-center text-xl font-semibold mb-4">
                  <InfoButton text={'The Cotton On-Call Report shows the quantity of call cotton bought or sold on which the price has not been fixed, together with the respective futures on which the purchase or sale is based. Call cotton refers to physical cotton bought or sold, or contracted for purchase or sale at a price to be fixed later based upon a specified delivery month future’s price. This report is released every Thursday at 3:30 pm, Eastern time and reflects position as of the previous week.  '} />
                  Cotton on Call
                </div>

                <div className="relative col-span-2 flex flex-col items-center">

                  <div className="col-span-3 grid grid-cols-3 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: 'Week' }, { name: 'Year' }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Year"
                      />
                    </div>
                    {WeekOrYear == 'Year' && (
                      <>
                        <div className="mb-4 w-full">

                          {/* <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="2324"
                          /> */}
                          <SingleSelectDropdown
                            options={getUniqueOptions(clientCottonOnCallData, 'season')}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="2324"
                          />
                        </div>
                      </>
                    )}
                    {WeekOrYear == 'Week' && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(clientCottonOnCallData, 'season_week')}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                    <div className="">
                      <MultipleSelectDropdown
                        options={[{ sales: 'october_sales', purchases: 'october_purchases', name: 'October' }, { sales: 'december_sales', purchases: 'december_purchases', name: 'December' }, { sales: 'march_sales', purchases: 'march_purchases', name: 'March' }, { sales: 'may_sales', purchases: 'may_purchases', name: 'May' }, { sales: 'july_sales', purchases: 'july_purchases', name: 'July' }]}
                        variable="name"
                        colour="bg-deep_blue"
                        label="Variables"
                        onSelectionChange={(e) => { if (e.length > 0) { setCottonSalesPropertiesArray(e.map((selection) => selection.sales)); setCottonPurchasesPropertiesArray(e.map((selection) => selection.purchases)); setCottonNamesArray(e.map((selection) => selection.name)) } }}
                        // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                        placeholder="Select Variables"
                        searchPlaceholder="Search Variables"
                        includeLabel={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col items-center">
                  {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
                  {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setSalesWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {salesWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setSalesYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {salesWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setSalesWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Sales by week</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), cottonSalesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Sales" /> */}
                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), cottonSalesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Sales" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Sales by year</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), cottonSalesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" /> */}
                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), cottonSalesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">
                  {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
                  {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setPurchasesWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {purchasesWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setPurchasesYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {purchasesWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setPurchasesWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Purchases by week</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), cottonPurchasesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Purchases" /> */}
                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), cottonPurchasesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Purchases" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Purchases by year</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), cottonPurchasesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Purchases" /> */}
                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), cottonPurchasesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Purchases" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">
                  {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
                  {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setTotalOnCallWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {totalOnCallWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setTotalOnCallYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {totalOnCallWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setTotalOnCallWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total on call sales and purchases by week</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), ["total_on_call_sales", "total_on_call_purchases"], ["Total on Call Sales", "Total on Call Purchases"])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Total" /> */}
                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Total" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total on call sales and purchases by year</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), ["total_on_call_sales", "total_on_call_purchases"], ["Total on Call Sales", "Total on Call Purchases"])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Total" /> */}
                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Total" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">
                  {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
                  {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setUOCWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {UOCWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setUOCYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {UOCWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setUOCWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total net U OC position by week</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), ["total_net_u_oc_position"], ["Total Net U OC Position"])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Net" /> */}
                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), ['total_net_u_oc_position'], ['Total Net U OC Position'])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Net" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total net U OC position by year</div>
                      <div className="mb-16 w-full">

                        {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), ["total_net_u_oc_position"], ["Total Net U OC Position"])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Net" /> */}
                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), ['total_net_u_oc_position'], ['Total Net U OC Position'])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Net" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Cotton On Call')} session={session} section="Cotton On Call" />
              </div>
            </div>
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">

              <div className="grid grid-cols-2 -mb-8">
                <div className="relative col-span-2 text-center text-xl font-semibold mb-4">
                  <InfoButton text={'The COT reports provide a breakdown of each Tuesday\'s open interest for markets in which 20 or more traders hold positions equal to or above the reporting levels established by the CFTC. The weekly reports are released every Friday at 3:30 p.m. Eastern time.'} />
                  Commitment of Traders
                </div>
                <div className="col-span-3 grid grid-cols-3 w-full gap-x-4 px-8">

                  <div className="mb-4 w-full">

                    <SingleSelectDropdown
                      options={[{ name: 'Week' }, { name: 'Year' }]}
                      label="Week or Year"
                      variable="name"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setCommitmentWeekOrYear(e.name)}
                      placeholder="Select Week or Year"
                      searchPlaceholder="Search Options"
                      includeLabel={false}
                      defaultValue="Year"
                    />
                  </div>
                  {commitmentWeekOrYear == 'Year' && (
                    <>
                      <div className="mb-4 w-full">

                        <SingleSelectDropdown
                          options={getUniqueOptions(JSON.parse(commitmentData), 'calendar_year')}
                          label="Year"
                          variable="value"
                          colour="bg-deep_blue"
                          onSelectionChange={(e) => setCommitmentYear(parseInt(e.value))}
                          placeholder="Select a specific year"
                          searchPlaceholder="Search Options"
                          includeLabel={false}
                          defaultValue="2023"
                        />
                      </div>
                    </>
                  )}
                  {commitmentWeekOrYear == 'Week' && (
                    <>
                      <div className="mb-4 w-full">

                        <SingleSelectDropdown
                          options={getUniqueOptions(JSON.parse(commitmentData), 'week')}
                          label="Week"
                          variable="value"
                          colour="bg-deep_blue"
                          onSelectionChange={(e) => setCommitmentWeek(parseInt(e.value))}
                          placeholder="Select a specific week"
                          searchPlaceholder="Search Options"
                          includeLabel={false}
                          defaultValue="1"
                        />
                      </div>
                    </>
                  )}
                  <div className="mb-4 w-full">

                    <MultipleSelectDropdown
                      options={[{ property: 'open_interest_all', name: 'Open Interest All' }, { property: 'producer_merchant_net', name: 'Producer Merchant Net' }, { property: 'swap_position_net', name: 'Swap Position Net' }, { property: 'managed_money_long', name: 'Managed Money Long' }, { property: 'managed_money_short', name: 'Managed Money Short' }, { property: 'managed_money_net', name: 'Managed Money Net' }, { property: 'other_reportables_net', name: 'Other Reportables Net' }, { property: 'total_reportables_net', name: 'Total Reportables Net' }, { property: 'non_reportables_net', name: 'Non Reportables Net' }, { property: 'specs_net', name: 'Specs Net' }]}
                      variable="name"
                      colour="bg-deep_blue"
                      label="Variables"
                      onSelectionChange={(e) => { if (e.length > 0) { setCommitmentPropertiesArray(e.map((selection) => selection.property)); setCommitmentNamesArray(e.map((selection) => selection.name)) } }}
                      // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                      placeholder="Select Variables"
                      searchPlaceholder="Search Variables"
                      includeLabel={false}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center">
                  {commitmentWeekOrYear == 'Year' && (
                    <>
                      <div className="relative w-full text-center mt-6 -mb-2 font-semibold">
                        <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                        Commitment of traders by Week
                      </div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime verticalTooltip={true} data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) == commitmentYear), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain2={52} xAxisTitle="Week" />
                      </div>
                    </>
                  )}
                  {commitmentWeekOrYear == 'Week' && (
                    <>
                      <div className="relative w-full text-center mt-6 -mb-2 font-semibold">
                        <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                        Commitment of traders by Year
                      </div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime verticalTooltip={true} data={getCommitmentOfTradersSeasonData(JSON.parse(commitmentData).filter((data) => parseInt(data.week) == commitmentWeek), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain1={2009} xDomain2={2023} xAxisTitle="Year" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Commitment Of Traders')} session={session} section="Commitment Of Traders" />
              </div>
            </div>
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">

              <div className="grid grid-cols-2 -mb-8">
                <div className="relative col-span-2 text-center text-xl font-semibold mb-4">
                  {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
                  Supply and Demand
                </div>
                <div className="col-span-3 grid grid-cols-3 w-full gap-x-4 px-8">

                  {/* <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedSupplyAndDemandStartDate} date={selectedSupplyAndDemandStartDate} formatter={formatter} />
                  </div>
                  <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedSupplyAndDemandEndDate} date={selectedSupplyAndDemandEndDate} formatter={formatter} />
                  </div> */}
                  <div className="mb-4 w-full">
                    <SingleSelectDropdown
                      options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 0, 1).toISOString() }))}
                      label="Week"
                      variable="year"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setSelectedSupplyAndDemandStartDate(e.value)}
                      placeholder="Select year"
                      searchPlaceholder="Search Options"
                      includeLabel={false}
                      defaultValue="2000"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <SingleSelectDropdown
                      options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 12, 31).toISOString() }))}
                      label="Week"
                      variable="year"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setSelectedSupplyAndDemandEndDate(e.value)}
                      placeholder="Select year"
                      searchPlaceholder="Search Options"
                      includeLabel={false}
                      defaultValue="2023"
                    />
                  </div>
                  <div className="mb-4 w-full">

                    <MultipleSelectDropdown
                      options={[{ property: 'beginning_stocks_usda', name: 'Beginning Stocks' }, { property: 'production_usda', name: 'Production' }, { property: 'imports_usda', name: 'Imports' }, { property: 'domestic_use_usda', name: 'Domestic Use' }, { property: 'exports_usda', name: 'Exports' }, { property: 'ending_stocks_usda', name: 'Ending Stocks' }]}
                      variable="name"
                      colour="bg-deep_blue"
                      label="Variables"
                      onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandPropertiesArray(e.map((selection) => selection.property)); setSupplyAndDemandNamesArray(e.map((selection) => selection.name)) } }}
                      // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                      placeholder="Select Variables"
                      searchPlaceholder="Search Variables"
                      includeLabel={false}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center">
                  {/* {commitmentWeekOrYear == "Year" && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Supply and Demand by Week</div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) == commitmentYear), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain2={52} xAxisTitle="Week" />
                      </div>
                    </>
                  )} */}
                  {/* {commitmentWeekOrYear == "Week" && (
                    <> */}
                  <div className="relative w-full text-center mt-6 -mb-2 font-semibold">
                    <InfoButton text={'The World Agricultural Supply and Demand Estimates (WASDE) is released monthly and provides annual forecasts for supply and use of U.S. and world cotton. '} />
                    Historical WASDE
                  </div>
                  <div className="mb-16 w-full">
                    {/* <LineGraph verticalTooltip={true} data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (new Date(data.date).getMonth() == new Date().getMonth() - 1) && (data.date < selectedSupplyAndDemandEndDate) && (data.date > selectedSupplyAndDemandStartDate)), supplyAndDemandPropertiesArray, supplyAndDemandNamesArray)} graphWidth={1000} /> */}
                    <LineGraph verticalTooltip={true} data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (data.date < selectedSupplyAndDemandEndDate) && (data.date > selectedSupplyAndDemandStartDate)), supplyAndDemandPropertiesArray, supplyAndDemandNamesArray)} graphWidth={1000} />
                  </div>
                  <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">
                      <SingleSelectDropdown
                        options={getUniqueOptions(JSON.parse(supplyAndDemandData), 'season').filter((uniqueOption) => {
                          if (parseInt(uniqueOption?.value.slice(0, 2)) > 19 && parseInt(uniqueOption?.value.slice(0, 2)) < 80) {
                            return true
                          } else {
                            return false
                          }
                        })}
                        label="Week"
                        variable="value"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setSelectedSupplyAndDemandSeason(e.value)}
                        placeholder="Select specific season"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="22/23"
                      />
                    </div>
                    <div className="mb-4 w-full">

                      <MultipleSelectDropdown
                        options={[{ property: 'beginning_stocks', name: 'Beginning Stocks' }, { property: 'production', name: 'Production' }, { property: 'imports', name: 'Imports' }, { property: 'domestic_use', name: 'Domestic Use' }, { property: 'exports', name: 'Exports' }, { property: 'ending_stocks', name: 'Ending Stocks' }]}
                        variable="name"
                        colour="bg-deep_blue"
                        label="Variables"
                        onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandProjectedPropertiesArray(e.reduce((acc, obj) => { acc.push(`${obj.property}_usda`); acc.push(`${obj.property}_eap`); return acc }, [])); setSupplyAndDemandProjectedNamesArray(e.reduce((acc, obj) => { acc.push(`${obj.name} USDA`); acc.push(`${obj.name} EAP`); return acc }, [])) } }}
                        // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                        placeholder="Select Variables"
                        searchPlaceholder="Search Variables"
                        includeLabel={false}
                      />
                    </div>
                  </div>
                  <div className="relative w-full text-center mt-6 -mb-2 font-semibold">
                    <InfoButton text={`Here you will find a graph showing historical data of many different variables included on the report such as production and consumption. 
Here is the difference between USDA and Macrovesta. 
`} />
                    Supply and Demand by Season
                  </div>
                  <div className="mb-16 w-full">
                    <LineGraph verticalTooltip={true} data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (data.season == selectedSupplyAndDemandSeason)), supplyAndDemandProjectedPropertiesArray, supplyAndDemandProjectedNamesArray)} graphWidth={1000} />
                  </div>
                  {/* </>
                  )} */}
                </div>
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Supply And Demand')} session={session} section="Supply And Demand" />
              </div>
            </div>
            <div className="flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="relative w-full text-center text-xl font-semibold mt-4">
                <InfoButton text={'A historical look into the December futures contract. '} />
                Future Contracts Study
              </div>
              {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
              <LineGraphNotTime verticalTooltip={false} xDomain1={0} xDomain2={12} data={(contract1 && contract2 && contract3) ? getStudyData(JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract1), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract2), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="text-center text-2xl mt-4">Please Select the Seasons you want to compare</div>
            <div className="grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl">
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Contract"
                  variable="year"
                  onSelectionChange={(e) => setContract1(e.year)}
                  placeholder="Select Contract"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract1}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season1)?.inverse_season}</div>
                </div> */}
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Season"
                  variable="year"
                  colour="bg-deep_blue"
                  onSelectionChange={(e) => setContract2(e.year)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract2}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season2)?.inverse_season}</div>
                </div> */}
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Contract"
                  variable="year"
                  colour="bg-turquoise"
                  onSelectionChange={(e) => setContract3(e.year)}
                  placeholder="Select Contract"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract3}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season3)?.inverse_season}</div>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 m-8">
              <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4">
                <div>Average High (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
                <div>Average Low (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
                <div>Average Price Range (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
                <div>Average High (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
                <div>Average Low (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
                <div>Average Price Range (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#ffffff] p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="relative w-full text-center text-xl font-semibold mt-4">
                <InfoButton text={'A historical look into different seasons where you can analyse them side-to-side. '} />
                V4
              </div>
              {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
              <LineGraphNotTime verticalTooltip={false} data={(season1 && season2 && season3) ? getSeasonData(JSON.parse(seasonsData).find((season) => season.season == season1), JSON.parse(seasonsData).find((season) => season.season == season2), JSON.parse(seasonsData).find((season) => season.season == season3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="text-center text-2xl mt-4">Please Select the Seasons you want to compare</div>
            <div className="grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl">
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(seasonsData)}
                  label="Season"
                  variable="season"
                  onSelectionChange={(e) => setSeason1(e.season)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Seasons"
                  includeLabel={false}
                  defaultValue={season1}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
                <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season1)?.inverse_season}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(seasonsData)}
                  label="Season"
                  variable="season"
                  colour="bg-deep_blue"
                  onSelectionChange={(e) => setSeason2(e.season)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Seasons"
                  includeLabel={false}
                  defaultValue={season2}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
                <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season2)?.inverse_season}</div>
                </div>
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(seasonsData)}
                  label="Season"
                  variable="season"
                  colour="bg-turquoise"
                  onSelectionChange={(e) => setSeason3(e.season)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Seasons"
                  includeLabel={false}
                  defaultValue={season3}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
                <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season3)?.inverse_season}</div>
                </div>
              </div>
            </div>
            <div className="text-xl text-center mt-8">Learn More with Macrovesta</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-24 text-lg">
              <Link href={{ pathname: 'https://eapconsult.com/dashboard/' }} >
                <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Learning Dash</div>
              </Link>
              <Link href={{ pathname: 'https://eapconsult.com/market-reports-2/' }} >
                <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Market Reports</div>
              </Link>
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

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/introduction'
      }
    }
  }

  // TODO Parallel querys using Promise.all - Better performance
  const [sentiment, basis, contract, season, future, countryNews, snapshot, monthlyIndex, seasonalIndex, comments, commitment, supplydemand, cottonreport, conclusion] = await Promise.all([
    prisma?.sentiment_survey.findMany({ orderBy: { date_of_survey: 'asc' } }),
    prisma?.basis_comparison.findMany({
      orderBy: {
        date_of_basis_report: 'asc'
      }
      // where: {
      //   date_of_basis_report: {
      //     gte: oneWeekAgo.toISOString(), // Filtering records greater than or equal to one week ago
      //     lte: today.toISOString() // Filtering records less than or equal to the current date
      //   }
      // }
    }),
    prisma?.cotton_contracts.findMany({}),
    prisma?.comparison_charts_with_17_months_year.findMany({ orderBy: { date_of_low: 'desc' } }),
    prisma?.future_contracts_study.findMany({ orderBy: { date_of_high: 'desc' } }),
    prisma?.in_country_news.findMany({ where: { verified: true }, orderBy: { date_of_in_country_news: 'desc' } }),
    prisma?.snapshot_strategy.findMany({ where: { verified: true }, orderBy: { date_of_snapshot_strategy: 'desc' } }),
    prisma?.monthly_index.findFirst({ where: { year: new Date().getFullYear(), month: getCurrentMonth() } }),
    prisma?.seasonal_index.findFirst({ /* where: {year: new Date().getFullYear()} */ }),
    prisma?.comments.findMany({ where: { date_of_comment: { gt: oneWeekAgo.toISOString() } }, orderBy: { date_of_comment: 'desc' } }),
    prisma?.commitment_of_traders.findMany({}),
    prisma?.supply_and_demand.findMany({ orderBy: { date: 'asc' } }),
    prisma?.external_Links.findMany({ where: { type: 'Cotton Report' }, orderBy: { date_created: 'desc' } }),
    prisma?.conclusion.findFirst({ orderBy: { date_created: 'desc' } })
  ])

  // Transform data for properly read by components
  const initialSentimentData = JSON.stringify(sentiment)
  const basisData = formatAndStringifyBasisData(basis)
  const contractData = groupAndStringifyContracts(contract)

  const seasonsData = JSON.stringify(season)
  const futureContractsStudyData = JSON.stringify(future)
  const countryNewsData = JSON.stringify(countryNews)
  const snapshotsData = JSON.stringify(snapshot)
  const monthlyIndexData = JSON.stringify(monthlyIndex)
  const seasonalIndexData = JSON.stringify(seasonalIndex)
  const commentsData = JSON.stringify(comments)
  // const onCall = await prisma?.cotton_on_call.findMany({})
  // const cottonOnCallData = JSON.stringify(onCall)
  const cottonOnCallData = JSON.stringify({ variable: 'hello world' })
  const commitmentData = JSON.stringify(commitment)
  // const exportdata = await prisma?.us_export_sales.findMany({})
  // const exportSalesData = JSON.stringify(exportdata)
  const exportSalesData = JSON.stringify({ variable: 'hello world' })
  const supplyAndDemandData = JSON.stringify(supplydemand)
  const cottonReportURLData = JSON.stringify(cottonreport)
  const conclusionData = JSON.stringify(conclusion)
  // const aIndex = await prisma?.a_index.findMany({})
  // const aIndexData = JSON.stringify(aIndex)
  const aIndexData = JSON.stringify({ variable: 'hello world' })
  // console.log(monthlyIndexData)

  return {
    props: { monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, contractData, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData, aIndexData }
  }
}

export default Home
