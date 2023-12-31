import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import Breadcrumbs from '../components/NavBar'
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

function getCurrentMonth() {
  // Create a new Date object
  const date = new Date()

  // Create an array of month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Get the month number from the Date object and use it to get the month name
  const monthName = monthNames[date.getMonth()]

  return monthName
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

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  if (isNaN(date)) {
    return undefined
  } else {
    return `${day}-${month}-${year}`
  }
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo]
}

const renderers = {
  h1: ({ node, ...props }) => <h1 {...props} />,
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  h4: ({ node, ...props }) => <h4 {...props} />,
  h5: ({ node, ...props }) => <h5 {...props} />,
  h6: ({ node, ...props }) => <h6 {...props} />
}

const Home: NextPage = ({ monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()
  console.log('session', session)
  console.log('session.submittedSurvey', session?.submittedSurvey)

  const todaysDate = new Date()

  const [sentimentData, setSentimentData] = React.useState(() => {
    try {
      return JSON.parse(initialSentimentData)
    } catch {
      return []
    }
  })

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
  const [snapshotPopup, setSnapshotPopup] = React.useState(null)

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

  const handleSentimentFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSentimentSubmitting(true)

    const bullish_or_bearish = e.target.bullishbearish.value
    const high = e.target.high.value
    const low = e.target.low.value
    const intraday_average_points = e.target.intraday.value
    const open_interest = e.target.open_interest.value
    let errorMessage = ''
    const warningMessage = ''

    // if (bullishBearish != null && bullishBearish != "Select an Option") {
    //   bullish_or_bearish = bullishBearish;
    // } else {
    //   errorMessage += "Please select bullish or bearish. ";
    // }

    if (bullish_or_bearish == null || bullish_or_bearish == '') {
      errorMessage += 'Please enter Estimate for market feeling. '
    }
    if (high == null || high == '') {
      errorMessage += 'Please enter Estimate for high. '
    }
    if (low == null || low == '') {
      errorMessage += 'Please enter Estimate for low. '
    }
    if (intraday_average_points == null || intraday_average_points == '') {
      errorMessage += 'Please enter Estimate for intraday average in points. '
    }
    if (open_interest == null || open_interest == '') {
      errorMessage += 'Please enter Estimate for open interest. '
    }

    if (warningMessage !== '') {
      setSentimentWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (sentimentWarning_Message != '') {
        setSentimentWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setSentimentError_Message(errorMessage)
      setSentimentWarningSubmit(false)
      setSentimentSubmitting(false)
    } else {
      if (sentimentError_Message != '') {
        setSentimentError_Message('')
      }

      if (sentimentWarningSubmit == false && warningMessage != '') {
        setSentimentWarningSubmit(true)
        setSentimentSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          bullish_or_bearish: bullish_or_bearish == '0' ? 'Neutral' : parseInt(bullish_or_bearish) < 0 ? 'Bearish' : 'Bullish',
          bullish_or_bearish_value: bullish_or_bearish,
          high,
          low,
          intraday_average_points,
          open_interest,
          email: session?.user.email,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-sentiment-survey-results'

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
        const result = await response.json().then(() => {
          setSentimentSubmitted(true)
          setSentimentSubmitting(false)
          setCurrentStage(1)
          // setSentimentData([...sentimentData, { record_id: "dummyid", bullish_or_bearish, high, low, intraday_average_points, open_interest }])
        })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

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

  const [selectedNewsType, setSelectedNewsType] = React.useState('')

  const handleSnapshotFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSnapshotSubmitting(true)

    let news_type = ''
    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value
    let errorMessage = ''
    let warningMessage = ''

    // console.log("textarea", text == "")

    if (selectedNewsType != null && selectedNewsType != '' && selectedNewsType != 'Select Snapshot Type') {
      news_type = selectedNewsType
    } else {
      errorMessage += 'Please select a snapshot type. '
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
      setSnapshotWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (snapshotWarning_Message != '') {
        setSnapshotWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setSnapshotError_Message(errorMessage)
      setSnapshotWarningSubmit(false)
      setSnapshotSubmitting(false)
    } else {
      if (snapshotError_Message != '') {
        setSnapshotError_Message('')
      }

      if (snapshotWarningSubmit == false && warningMessage != '') {
        setSnapshotWarningSubmit(true)
        setSnapshotSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          title,
          text,
          image,
          user: session?.user?.name,
          news_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-snapshot'

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
        const result = await response.json().then(() => { setSnapshotSubmitted(true); setSnapshotSubmitting(false) })
        // setSnapshotSubmitted(true); setSnapshotSubmitting(false)
      }
    }
  }
  const [snapshotError_Message, setSnapshotError_Message] = React.useState('')
  const [snapshotSubmitted, setSnapshotSubmitted] = React.useState(false)
  const [snapshotSubmitting, setSnapshotSubmitting] = React.useState(false)
  const [snapshotWarning_Message, setSnapshotWarning_Message] = React.useState('')
  const [snapshotWarningSubmit, setSnapshotWarningSubmit] = React.useState(false)

  const handleCountryNewsFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setCountryNewsSubmitting(true)

    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value
    let errorMessage = ''
    let warningMessage = ''

    // console.log("textarea", text == "")

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

  const [sentimentError_Message, setSentimentError_Message] = React.useState('')
  const [sentimentSubmitted, setSentimentSubmitted] = React.useState(false)
  const [sentimentSubmitting, setSentimentSubmitting] = React.useState(false)
  const [sentimentWarning_Message, setSentimentWarning_Message] = React.useState('')
  const [sentimentWarningSubmit, setSentimentWarningSubmit] = React.useState(false)

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

  const basisBarChartData = (originalData: formattedBasis) => {
    const today = new Date() // Current date
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const data: formattedBasis = originalData.filter((basis: formattedBasis[number]) => basis.date_of_basis_report > oneWeekAgo.toISOString())
    const result: CountryData[] = Object.values(data.reduce((accumulator: { [key: string]: CountryData }, current) => {
      const { country, CTZ23, CTZ24 } = current

      if (!accumulator[country]) {
        accumulator[country] = {
          country,
          CTZ23: CTZ23 || 0,
          CTZ24: CTZ24 || 0
        }
      } else {
        accumulator[country]!.CTZ23 += CTZ23 || 0
        accumulator[country]!.CTZ24 += CTZ24 || 0
      }

      return accumulator
    }, {})).map((countryData: CountryData) => {
      const { country, CTZ23, CTZ24 } = countryData
      const count = data.filter(obj => obj.country === country).length

      return {
        country,
        CTZ23: parseFloat((CTZ23 / count).toFixed(0)),
        CTZ24: parseFloat((CTZ24 / count).toFixed(0))
      }
    })

    console.log(result)
    return result
  }

  function getWeek(date, startDay) {
    const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    tempDate.setUTCDate(tempDate.getUTCDate() + 3 - (tempDate.getUTCDay() + 6 - startDay + 7) % 7)
    const week1 = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 4))
    return 1 + Math.ceil(((tempDate - week1) / 86400000 + 3) / 7)
  }

  function transformData(input) {
    const contract1Data = { name: 'CTZ23', data: [], noCircles: true }
    const contract2Data = { name: 'CTZ24', data: [], noCircles: true }
    input.forEach((item) => {
      contract1Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ23 })
      contract2Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ24 })
    })

    return [contract1Data, contract2Data]
  }

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

  function transformSurveyData(inputArray, propertyUsed) {
    const outputArray = []
    const averages = {}
    // const combinedSeries = {
    //   name: "Combined",
    //   data: []
    // };
    averages.Bullish = {}
    averages.Bearish = {}
    averages.Neutral = {}

    for (const obj of inputArray) {
      const groupName = obj.bullish_or_bearish

      if (!averages[groupName]) {
        averages[groupName] = {}
      }
      if (!averages.Average) {
        averages.Average = {}
      }

      const date = new Date(obj.date_of_survey)
      const dateString = date.toISOString().split('T')[0]

      if (!averages[groupName][dateString]) {
        averages[groupName][dateString] = {
          sum: 0,
          count: 0
        }
      }
      if (!averages.Average[dateString]) {
        averages.Average[dateString] = {
          sum: 0,
          count: 0
        }
      }

      averages[groupName][dateString].sum += parseFloat(obj[propertyUsed])
      averages[groupName][dateString].count++
      averages.Average[dateString].sum += parseFloat(obj[propertyUsed])
      averages.Average[dateString].count++

      // Add the values to the combined series
      // if (!isNaN(parseFloat(obj[propertyUsed]))) {
      //   if (!combinedSeries.data[dateString]) {
      //     combinedSeries.data[dateString] = {
      //       sum: 0,
      //       count: 0
      //     };
      //   }

      //   combinedSeries.data[dateString].sum += parseFloat(obj[propertyUsed]);
      //   combinedSeries.data[dateString].count++;
      // }
    }

    for (const groupName in averages) {
      const group = averages[groupName]
      const data = []

      for (const dateString in group) {
        const average =
          group[dateString].sum / group[dateString].count
        const date = new Date(dateString)

        data.push({
          time: date.toISOString(),
          value: average
        })
      }
      if (groupName == 'Average') {
        outputArray.push({
          name: groupName,
          data,
          dottedLine: true
        })
      } else {
        outputArray.push({
          name: groupName,
          data
        })
      }
    }
    // Calculate the average for the combined series
    // for (const dateString in combinedSeries.data) {
    //   const average =
    //     combinedSeries.data[dateString].sum / combinedSeries.data[dateString].count;
    //   const date = new Date(dateString);

    //   combinedSeries.data[dateString] = {
    //     time: date.toISOString(),
    //     value: average
    //   };
    // }

    // outputArray.push(combinedSeries);
    console.log(propertyUsed, outputArray)
    return outputArray
  }

  function calculateSpread(arr1, arr2, name) {
    // Transform arrays into maps for easy lookup
    const map1 = new Map(arr1.map(item => [item.datetime, item.close]))
    const map2 = new Map(arr2.map(item => [item.datetime, item.close]))

    // Find the later start date
    const start1 = new Date(arr1[0].datetime)
    const start2 = new Date(arr2[0].datetime)
    const start = start1 > start2 ? start1.toISOString() : start2.toISOString()

    // Merge arrays
    const merged = []
    for (const [datetime, close1] of map1) {
      if (datetime >= start) {
        const close2 = map2.get(datetime)
        if (close2 !== undefined) {
          merged.push({
            time: datetime,
            value: Number((close1 - close2).toPrecision(4))
          })
        }
      }
    }

    return [{ name, data: merged, noCircles: true, noHover: true }]
  }

  const addFullYear = (twoDigitYear) => {
    if (twoDigitYear[0] == '0' || twoDigitYear[0] == '1' || twoDigitYear[0] == '2') {
      const newYear = `20${twoDigitYear}`
      // return `20${twoDigitYear}`
      return newYear
    } else {
      return `19${twoDigitYear}`
    }
  }

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
  const getCottonOnCallWeekData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: item.date, y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: item.date, y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
  const getCottonOnCallSeasonData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: parseInt(addFullYear(String(item.season).substring(0, 2))), y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: parseInt(addFullYear(String(item.season).substring(0, 2))), y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
  const getCommitmentOfTradersWeekData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
  const getCommitmentOfTradersSeasonData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }

  const getSupplyAndDemandData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          if (parseInt(item[property]) != 0) {
            const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
            dataset.data.push({ time: item.date, value: parseInt(item[property]) })
          }
        } else {
          if (parseInt(item[property]) != 0) {
            const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
            dataset.data.push({ time: item.date, value: parseInt(item[property]) })
            datasetArray.push(dataset)
          }
        }
      })
    })
    return datasetArray
  }

  const getUSExportSalesData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: item.week_ending, y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: item.week_ending, y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
  const getUSExportSalesWeekData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
  const getUSExportSalesSeasonData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }
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
  const [Year, setYear] = React.useState('0102')
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

  const [commitmentWeekOrYear, setCommitmentWeekOrYear] = React.useState('Week')
  const [commitmentYear, setCommitmentYear] = React.useState(2010)
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

  const temp = new Date()
  temp.setSeconds(0)
  const dd = String(temp.getDate()).padStart(2, '0')
  const mm = String(temp.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = temp.getFullYear()

  const today = `${yyyy}-${mm}-${dd}`

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
  const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = React.useState(parseDate('2020-01-01'))
  const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = React.useState(parseDate('2023-12-31'))
  const [selectedSupplyAndDemandSeason, setSelectedSupplyAndDemandSeason] = React.useState('20/21')

  const temp3 = new Date()
  temp3.setFullYear(temp3.getFullYear() - 1)

  const year2 = temp3.getFullYear()
  const month2 = (temp3.getMonth() + 1).toString().padStart(2, '0') // add leading zero if necessary
  const day2 = temp3.getDate().toString().padStart(2, '0') // add leading zero if necessary

  const dateOneYearAgo = `${year2}-${month2}-${day2}`

  const dateToday = new Date() // Current date
  const oneWeekAgo = new Date(dateToday.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [selectedCottonContractsStartDate, setSelectedCottonContractsStartDate] = React.useState(parseDate(dateOneYearAgo))
  const [selectedCottonContractsEndDate, setSelectedCottonContractsEndDate] = React.useState(parseDate(today))

  // const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(["open_interest_all", "producer_merchant_net", "swap_position_net", "managed_money_net", "other_reportables_net", "total_reportables_net", "non_reportables_net", "specs_net"])
  // const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(["Open Interest All", "Producer Merchant Net", "Swap Position Net", "Managed Money Net", "Other Reportables Net", "Total Reportables Net", "Non Reportables Net", "Specs Net"])
  const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(['specs_net'])
  const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(['Specs Net'])

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
  const [contractParameter, setContractParameter] = React.useState('close')

  const getSeasonData = (s1, s2, s3) => {
    const array = []
    if (s1 != null && s1 != 'Select Season') {
      const s1Data = { name: s1.season, data: [{ x: s1.month_of_low, y: s1.low_price }, { x: s1.month_of_high, y: s1.high_price }] }
      array.push(s1Data)
    }
    if (s2 != null && s2 != 'Select Season') {
      const s2Data = { name: s2.season, data: [{ x: s2.month_of_low, y: s2.low_price }, { x: s2.month_of_high, y: s2.high_price }] }
      array.push(s2Data)
    }
    if (s3 != null && s3 != 'Select Season') {
      const s3Data = { name: s3.season, data: [{ x: s3.month_of_low, y: s3.low_price }, { x: s3.month_of_high, y: s3.high_price }] }
      array.push(s3Data)
    }
    return array
  }
  const getStudyData = (s1, s2, s3) => {
    const array = []
    if (s1 != null && s1 != 'Select Contract') {
      const s1Data = { name: s1.year, data: [{ x: s1.month_of_low, y: s1.low }, { x: s1.month_of_high, y: s1.high }] }
      array.push(s1Data)
    }
    if (s2 != null && s2 != 'Select Contract') {
      const s2Data = { name: s2.year, data: [{ x: s2.month_of_low, y: s2.low }, { x: s2.month_of_high, y: s2.high }] }
      array.push(s2Data)
    }
    if (s3 != null && s3 != 'Select Contract') {
      const s3Data = { name: s3.year, data: [{ x: s3.month_of_low, y: s3.low }, { x: s3.month_of_high, y: s3.high }] }
      array.push(s3Data)
    }
    return array
  }

  const averageFutureContract = (data, property) => {
    const array = data.reduce((acc, obj) => {
      acc[0] += parseFloat(obj[property])
      acc[1]++
      return acc
    }, [0, 0])
    return array[0] / array[1]
  }

  const [selectedCostType, setSelectedCostType] = React.useState('FOB')

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
      </Head>
      <main className="main grid grid-cols-[160px_auto] h-screen items-center bg-slate-200">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-50 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Overview'} urlPath={urlPath} user={session?.user.name} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200 text-center">
            {/* ---------------------------------------------------------------------------------------------- */}
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">

              {/* <div>
                <LineGraph data={linedata} />
              </div> */}

              <div className="text-center font-semibold text-xl">
                The Macrovesta Index {session?.user.id}
              </div>
              <div className="flex justify-around gap-8">
                {/* <IndexDial probability={0} /> */}

                <div className="relative">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />

                  <div className="text-center font-semibold">
                    Monthly Index
                  </div>
                  <div className="justify-self-end">
                    {/* <SemiCircleDial value={2.66} rangeStart={-5} rangeEnd={5} arcAxisText={["-5", "-3", "0", "3", "5"]} leftText="Bearish" rightText="Bullish" decimals={1} /> */}
                    <SemiCircleDial value={parseFloat(JSON.parse(monthlyIndexData).probability_rate) * (JSON.parse(monthlyIndexData).inverse_month == 'Y' ? -1 : 1)} />
                  </div>
                  {/* {selectAppropriateImage(JSON.parse(monthlyIndexData).inverse_month, parseFloat(JSON.parse(monthlyIndexData).probability_rate))}

                  <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
                    transform: `rotate(${90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month == "Y" ? 1 : -1)}deg)`
                  }}>

                  </div>
                  <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(monthlyIndexData).probability_rate}</div> */}
                </div>
                <div className="relative flex flex-col justify-between">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />

                  <div className="text-center font-semibold">
                    Seasonal Index
                  </div>
                  <div className="justify-self-end">
                    {/* <SemiCircleDial value={2.66} rangeStart={-5} rangeEnd={5} arcAxisText={["-5", "-3", "0", "3", "5"]} leftText="Bearish" rightText="Bullish" decimals={1} /> */}
                    <SemiCircleDial value={parseFloat(JSON.parse(seasonalIndexData).probability_rate) * (JSON.parse(seasonalIndexData).inverse_year == 'Y' ? -1 : 1)} />
                  </div>
                  {/* {selectAppropriateImage(JSON.parse(seasonalIndexData).inverse_year, parseFloat(JSON.parse(seasonalIndexData).probability_rate))}
                  <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
                    transform: `rotate(${90 - (parseFloat(JSON.parse(seasonalIndexData).probability_rate) / 100 * 90) * (JSON.parse(seasonalIndexData).inverse_year == "Y" ? 1 : -1)}deg)`
                  }}>

                  </div>
                  <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(seasonalIndexData).probability_rate}</div> */}
                </div>

              </div>
            </div>
            {/* ---------------------------------------------------------------------------------------------- */}
            {JSON.parse(commentsData).find((obj) => obj.section == 'Current Contract' && obj.added_by == 'Victor Fernandes')?.comment != undefined && (
              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                <div className="grid grid-cols-1">
                  <div className="relative flex flex-col gap-y-6 items-center px-8">
                    <div className="text-left font-semibold text-lg">Conclusion of Current Front Month</div>
                    <div>{JSON.parse(commentsData).find((obj) => obj.section == 'Current Contract' && obj.added_by == 'Victor Fernandes')?.comment}</div>
                    {/* <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == "en")?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a> */}
                    {/* <div>{currentLang}</div> */}
                  </div>
                  {/* <div className="flex flex-col gap-4">
                  <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
                  <div className="grid place-content-center w-full">
                    <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
                  </div>
                </div> */}
                </div>
              </div>
            )}
            {/* ---------------------------------------------------------------------------------------------- */}
            <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <div className="flex justify-around gap-8">
                <div className="relative w-full text-center font-semibold text-xl">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                  Recent Events
                </div>
                <div className="relative w-full text-center font-semibold text-xl">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                  Future Considerations
                </div>
              </div>
              <div className="flex justify-around gap-x-8">
                <div className="flex flex-col w-full justify-start items-start gap-x-8 gap-y-4 mt-4">
                  {/* {JSON.parse(snapshotsData).map((snapshot) => (
                  <div>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                ))} */}
                  {JSON.parse(snapshotsData).filter((object: any, index: number) => object.news_type == 'Recent Events' && object.impact == 'High').filter((object: any, index: number) => index < 8).map((snapshot) => (
                    <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                      {snapshot.title_of_snapshot_strategy}
                    </div>
                  ))}
                  {snapshotPopup != null && (
                    <div className='absolute modal left-0 top-0 z-40'>
                      <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                          <img className="w-3/4" src={snapshotPopup.image_of_snapshot_strategy} />
                          <div className="my-4 font-semibold text-lg">
                            {snapshotPopup.title_of_snapshot_strategy}
                          </div>
                          <div className="-mt-4 mb-2">
                            {parseDateString(snapshotPopup.date_of_snapshot_strategy)}
                          </div>
                          <div className="">
                            {snapshotPopup.text_of_snapshot_strategy}
                          </div>
                        </div>
                        <div onClick={() => setSnapshotPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full justify-start items-start gap-x-8 gap-y-4 mt-4">
                  {/* {JSON.parse(snapshotsData).map((snapshot) => (
                  <div>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                ))} */}
                  {JSON.parse(snapshotsData).filter((object: any, index: number) => ((object.news_type == 'Short Term' || object.news_type == 'Long Term') && object.impact == 'High')).filter((object: any, index: number) => index < 8).sort((a, b) => { if (a.news_type < b.news_type) return 1; if (a.news_type > b.news_type) return -1; return 0 }).map((snapshot) => (
                    <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full h-fit py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                      <div>
                        {snapshot.title_of_snapshot_strategy}
                      </div>
                      <div>
                        {snapshot.news_type}
                      </div>
                    </div>
                  ))}
                  {snapshotPopup != null && (
                    <div className='absolute modal left-0 top-0 z-40'>
                      <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                          <img className="w-3/4" src={snapshotPopup.image_of_snapshot_strategy} />
                          <div className="my-4 font-semibold text-lg">
                            {snapshotPopup.title_of_snapshot_strategy}
                          </div>
                          <div className="-mt-4 mb-2">
                            {parseDateString(snapshotPopup.date_of_snapshot_strategy)}
                          </div>
                          <div className="">
                            {snapshotPopup.text_of_snapshot_strategy}
                          </div>
                        </div>
                        <div onClick={() => setSnapshotPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {(session?.role == 'partner' || session?.role == 'admin') && (
                <div className="flex justify-center">
                  <div className="bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenSnapshotForm(true)}>
                    Add 30 Seconds Snapshot
                  </div>
                </div>
              )}
              {openSnapshotForm && (
                <div className='absolute modal left-0 top-0 z-40'>
                  <div className=' fixed grid place-content-center inset-0 z-40'>
                    <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                      <div className="my-4 font-semibold text-lg">
                        Add 30 Seconds Snapshot
                      </div>
                      <div className="w-full">
                        <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleSnapshotFormSubmit}>
                          <div className="mb-4">
                            <div className="mb-4">
                              <SingleSelectDropdown
                                options={[{ name: 'Recent Events', value: 'Recent Events' }, { name: 'Short Term Consideration', value: 'Short Term' }, { name: 'Long Term Consideration', value: 'Long Term' }]}
                                label="snapshot_type"
                                variable="name"
                                colour="bg-deep_blue"
                                onSelectionChange={(e) => setSelectedNewsType(e.value)}
                                placeholder="Select Snapshot Type"
                                searchPlaceholder="Search Types"
                                includeLabel={false}
                              />
                            </div>
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
                            <textarea id="text" placeholder="Enter text" name="text" rows={4} cols={87} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"></textarea>
                          </div>

                          <div className="col-span-2 flex justify-center">
                            {/* <button
                                type="submit"
                                className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                              >
                                Submit
                              </button> */}
                            <FormSubmit errorMessage={snapshotError_Message} warningMessage={snapshotWarning_Message} submitted={snapshotSubmitted} submitting={snapshotSubmitting} warningSubmit={snapshotWarningSubmit} />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div onClick={() => setOpenSnapshotForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                  </div>
                </div>
              )}
            </div>
            {/* ---------------------------------------------------------------------------------------------- */}
            <div className="grid grid-cols-1 xl:grid-cols-1 m-8 gap-8">

              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <div className="relative text-center font-semibold text-xl">
                  <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                  In Country News
                </div>
                <div className="flex flex-col justify-around items-start gap-4 mt-4">
                  {JSON.parse(countryNewsData).filter((object) => object.impact == 'High').filter((object: any, index: number) => index < 10).map((news) => (
                    <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setCountryNewsPopup(news)}>
                      {news.title_of_in_country_news}
                    </div>
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
            {/* ---------------------------------------------------------------------------------------------- */}
            {JSON.parse(commentsData).find((obj) => obj.section == 'Cotton On Call' && obj.added_by == 'Victor Fernandes')?.comment != undefined && (
              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                <div className="grid grid-cols-1">
                  <div className="relative flex flex-col gap-y-6 items-center px-8">
                    <div className="text-left font-semibold text-lg">Conclusion of CFTC Cotton On Call</div>
                    <div>{JSON.parse(commentsData).find((obj) => obj.section == 'Cotton On Call' && obj.added_by == 'Victor Fernandes')?.comment}</div>
                    {/* <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == "en")?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a> */}
                    {/* <div>{currentLang}</div> */}
                  </div>
                  {/* <div className="flex flex-col gap-4">
                  <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
                  <div className="grid place-content-center w-full">
                    <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
                  </div>
                </div> */}
                </div>
              </div>
            )}
            {/* ---------------------------------------------------------------------------------------------- */}
            {JSON.parse(commentsData).find((obj) => obj.section == 'Commitment Of Traders' && obj.added_by == 'Victor Fernandes')?.comment != undefined && (
              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                <div className="grid grid-cols-1">
                  <div className="relative flex flex-col gap-y-6 items-center px-8">
                    <div className="text-left font-semibold text-lg">Conclusion of Commitment of traders</div>
                    <div>{JSON.parse(commentsData).find((obj) => obj.section == 'Commitment Of Traders' && obj.added_by == 'Victor Fernandes')?.comment}</div>
                    {/* <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == "en")?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a> */}
                    {/* <div>{currentLang}</div> */}
                  </div>
                  {/* <div className="flex flex-col gap-4">
                  <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
                  <div className="grid place-content-center w-full">
                    <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
                  </div>
                </div> */}
                </div>
              </div>
            )}
            {/* ---------------------------------------------------------------------------------------------- */}
            {JSON.parse(commentsData).find((obj) => obj.section == 'Supply And Demand' && obj.added_by == 'Victor Fernandes')?.comment != undefined && (
              <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                <div className="grid grid-cols-1">
                  <div className="relative flex flex-col gap-y-6 items-center px-8">
                    <div className="text-left font-semibold text-lg">Conclusion of Supply and Demand</div>
                    <div>{JSON.parse(commentsData).find((obj) => obj.section == 'Supply And Demand' && obj.added_by == 'Victor Fernandes')?.comment}</div>
                    {/* <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == "en")?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a> */}
                    {/* <div>{currentLang}</div> */}
                  </div>
                  {/* <div className="flex flex-col gap-4">
                  <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
                  <div className="grid place-content-center w-full">
                    <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
                  </div>
                </div> */}
                </div>
              </div>
            )}
            {/* ---------------------------------------------------------------------------------------------- */}
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
              <div className="grid grid-cols-1">
                <div className="relative flex flex-col gap-y-6 items-center px-8">
                  <div className="text-left font-semibold text-lg">Conclusion of latest market report</div>
                  <div>{JSON.parse(conclusionData)?.text}</div>
                  <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == 'en')?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a>
                  {/* <div>{currentLang}</div> */}
                </div>
                {/* <div className="flex flex-col gap-4">
                  <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
                  <div className="grid place-content-center w-full">
                    <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
                  </div>
                </div> */}
              </div>
            </div>
            {/* ---------------------------------------------------------------------------------------------- */}
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
        destination: '/'
      }
    }
  }

  const contract = await prisma?.cotton_contracts.findMany({})

  const contractsObject = contract.reduce((acc, obj) => {
    if (acc[obj.contract] == undefined) {
      acc[obj.contract] = [obj]
    } else {
      acc[obj.contract].push(obj)
    }
    return acc
  }, {})

  const CTZ23 = contractsObject?.CTZ23
  const CTH24 = contractsObject?.CTH24
  const CTK24 = contractsObject?.CTK24
  const CTN24 = contractsObject?.CTN24
  const CTZ24 = contractsObject?.CTZ24

  const CTZ23Data = JSON.stringify(CTZ23)
  const CTH24Data = JSON.stringify(CTH24)
  const CTK24Data = JSON.stringify(CTK24)
  const CTN24Data = JSON.stringify(CTN24)
  const CTZ24Data = JSON.stringify(CTZ24)

  const sentiment = await prisma?.sentiment_survey.findMany({
    orderBy: {
      date_of_survey: 'asc'
    }
  })
  const initialSentimentData = JSON.stringify(sentiment)

  console.log('intitalData', initialSentimentData)

  const today = new Date() // Current date
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const basis = await prisma?.basis_comparison.findMany({
    orderBy: {
      date_of_basis_report: 'asc'
    }
    // where: {
    //   date_of_basis_report: {
    //     gte: oneWeekAgo.toISOString(), // Filtering records greater than or equal to one week ago
    //     lte: today.toISOString() // Filtering records less than or equal to the current date
    //   }
    // }
  })

  // console.log("basis length", basis.length)

  const formattedBasis = basis.map((basis) => {
    console.log('cost_type', basis.cost_type)
    const { country, date_of_basis_report, contract_december_2023: CTZ23, contract_december_2024: CTZ24, cost_type } = basis
    return { country, date_of_basis_report, CTZ23, CTZ24, cost_type }
  })

  const basisData = JSON.stringify(formattedBasis)

  const season = await prisma?.comparison_charts_with_17_months_year.findMany({
    orderBy: {
      date_of_low: 'desc'
    }
  })
  const seasonsData = JSON.stringify(season)

  const future = await prisma?.future_contracts_study.findMany({
    orderBy: {
      date_of_high: 'desc'
    }
  })

  const futureContractsStudyData = JSON.stringify(future)

  const countryNews = await prisma?.in_country_news.findMany({
    where: {
      verified: true
    },
    orderBy: {
      date_of_in_country_news: 'desc'
    }
  })
  const countryNewsData = JSON.stringify(countryNews)

  const snapshot = await prisma?.snapshot_strategy.findMany({
    where: {
      verified: true
    },
    orderBy: {
      date_of_snapshot_strategy: 'desc'
    }
  })
  const snapshotsData = JSON.stringify(snapshot)

  const monthlyindex = await prisma?.monthly_index.findFirst({
    where: {
      year: new Date().getFullYear(),
      month: getCurrentMonth()
    }
  })
  const monthlyIndexData = JSON.stringify(monthlyindex)

  const seasonalIndex = await prisma?.seasonal_index.findFirst({
    // where: {
    //   year: new Date().getFullYear()
    // }
  })
  const seasonalIndexData = JSON.stringify(seasonalIndex)

  const comment = await prisma?.comments.findMany({
    where: {
      date_of_comment: {
        gt: oneWeekAgo.toISOString()
      }
    },
    orderBy: {
      date_of_comment: 'desc'
    }
  })
  const commentsData = JSON.stringify(comment)

  const onCall = await prisma?.cotton_on_call.findMany({

  })

  const cottonOnCallData = JSON.stringify(onCall)

  const commitment = await prisma?.commitment_of_traders.findMany({

  })

  const commitmentData = JSON.stringify(commitment)

  const exportdata = await prisma?.us_export_sales.findMany({})

  const exportSalesData = JSON.stringify(exportdata)

  const supplydemand = await prisma?.supply_and_demand.findMany({})

  const supplyAndDemandData = JSON.stringify(supplydemand)

  const cottonreport = await prisma?.external_Links.findMany({
    where: {
      type: 'Cotton Report'
    },
    orderBy: {
      date_created: 'desc'
    }
  })

  const cottonReportURLData = JSON.stringify(cottonreport)

  const conclusion = await prisma?.conclusion.findFirst({
    orderBy: {
      date_created: 'desc'
    }
  })

  const conclusionData = JSON.stringify(conclusion)

  // console.log(monthlyIndexData)
  return {
    props: { monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData }
  }
}

export default Home
