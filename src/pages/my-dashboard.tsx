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
import DragDrop from '../components/dragDrop'

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

const MyDashboard: NextPage = ({ templateData, monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData, aIndexData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()
  console.log('session', session)
  console.log('session.submittedSurvey', session?.submittedSurvey)
  const todaysDate = new Date()

  const sentimentData = JSON.parse(initialSentimentData)
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

  const [templateArray, setTemplateArray] = React.useState(JSON.parse(JSON.parse(templateData))?.templateArray)

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

  const temp = new Date()
  temp.setSeconds(0)
  const dd = String(temp.getDate()).padStart(2, '0')
  const mm = String(temp.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = temp.getFullYear()

  const today = `${yyyy}-${mm}-${dd}`

  const temp3 = new Date()
  temp3.setFullYear(temp3.getFullYear() - 1)

  const year2 = temp3.getFullYear()
  const month2 = (temp3.getMonth() + 1).toString().padStart(2, '0') // add leading zero if necessary
  const day2 = temp3.getDate().toString().padStart(2, '0') // add leading zero if necessary

  const dateOneYearAgo = `${year2}-${month2}-${day2}`

  const [selectedCottonContractsStartDate, setSelectedCottonContractsStartDate] = React.useState(parseDate(dateOneYearAgo))
  const [selectedCottonContractsEndDate, setSelectedCottonContractsEndDate] = React.useState(parseDate(today))

  const [contractParameter, setContractParameter] = React.useState('close')
  const [contractParameterName, setContractParameterName] = React.useState('Close')

  const locale = useLocale()

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const formatter = new Intl.DateTimeFormat(locale, options)

  const [selectedIndexStartDate, setSelectedIndexStartDate] = React.useState(parseDate('2023-01-01'))
  const [selectedIndexEndDate, setSelectedIndexEndDate] = React.useState(parseDate(today))

  // const [indexPropertiesArray, setIndexPropertiesArray] = React.useState(["a_index", "ice_highest_open_interest_17_months"])
  // const [indexNamesArray, setIndexNamesArray] = React.useState(["A-Index", "Ice Highest"])

  const getAIndexData = (data, propertyArray, datasetNameArray) => {
    const datasetArray = []
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          const dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: item.date, y: parseFloat(item[property]) })
          // dataset.data.push({ x: item.date, y: parseFloat(item[spreadVariable]) - parseFloat(item[property]) })
        } else {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: item.date, y: parseFloat(item[property]) })
          // dataset.data.push({ x: item.date, y: parseFloat(item[spreadVariable]) - parseFloat(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }

  const [clientAIndexData, setClientAIndexData] = React.useState([])
  const [clientUSExportSalesData, setClientUSExportSalesData] = React.useState([])
  const [clientCottonOnCallData, setClientCottonOnCallData] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using the fetch method
        const response = await fetch('/api/get-a-index-data')

        // Check if the request was successful
        if (response.ok) {
          // Parse the JSON data from the response
          const result = await response.json()

          // Update the state with the fetched data
          setClientAIndexData(result)
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

  const [currentStage, setCurrentStage] = React.useState(0)

  const averageMarketSentiment = () => {
    const data = sentimentData.filter((sentiment) => new Date(sentiment.date_of_survey) > oneWeekAgo)
    const total = data.reduce((acc, obj) => { acc += parseFloat(obj.bullish_or_bearish_value); return acc }, 0)
    console.log('total', total)
    return sentimentData.length > 0 ? total / data.length : 0
  }

  function transformSurveyData(inputArray, propertyUsed, precision = 2) {
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
    }

    for (const groupName in averages) {
      const group = averages[groupName]
      const data = []

      for (const dateString in group) {
        const average =
          parseFloat((group[dateString].sum / group[dateString].count).toFixed(precision))
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
    console.log(propertyUsed, outputArray)
    return outputArray
  }

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

  const [sentimentError_Message, setSentimentError_Message] = React.useState('')
  const [sentimentSubmitted, setSentimentSubmitted] = React.useState(false)
  const [sentimentSubmitting, setSentimentSubmitting] = React.useState(false)
  const [sentimentWarning_Message, setSentimentWarning_Message] = React.useState('')
  const [sentimentWarningSubmit, setSentimentWarningSubmit] = React.useState(false)

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

  const [countryNewsPopup, setCountryNewsPopup] = React.useState(null)
  const [snapshotPopup, setSnapshotPopup] = React.useState(null)

  const [openBasisCostForm, setOpenBasisCostForm] = React.useState(false)
  const [openSnapshotForm, setOpenSnapshotForm] = React.useState(false)
  const [openCountryNewsForm, setOpenCountryNewsForm] = React.useState(false)

  const [selectedCountry, setSelectedCountry] = React.useState(undefined)
  const [selectedFormCostType, setSelectedFormCostType] = React.useState(undefined)

  const [selectedNewsType, setSelectedNewsType] = React.useState('')
  const [selectedNewsTypeName, setSelectedNewsTypeName] = React.useState('')

  const [snapshotError_Message, setSnapshotError_Message] = React.useState('')
  const [snapshotSubmitted, setSnapshotSubmitted] = React.useState(false)
  const [snapshotSubmitting, setSnapshotSubmitting] = React.useState(false)
  const [snapshotWarning_Message, setSnapshotWarning_Message] = React.useState('')
  const [snapshotWarningSubmit, setSnapshotWarningSubmit] = React.useState(false)

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

  const [selectedCostType, setSelectedCostType] = React.useState('FOB')

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

  function transformData(input) {
    const contract1Data = { name: 'CTZ23', data: [], noCircles: true }
    const contract2Data = { name: 'CTZ24', data: [], noCircles: true }
    input.forEach((item) => {
      contract1Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ23 })
      contract2Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ24 })
    })

    return [contract1Data, contract2Data]
  }

  const [basisCountry, setBasisCountry] = React.useState('Brazil')

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

  // const [exportPropertiesArray, setExportPropertiesArray] = React.useState(["net_sales", "next_marketing_year_net_sales"])
  // const [exportNamesArray, setExportNamesArray] = React.useState(["Net Sales", "Next Marketing Year Net Sales"])

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

  const [countryNewsFilter, setCountryNewsFilter] = React.useState('All Countries')
  const [countryNewsFormCountry, setCountryNewsFormCountry] = React.useState('')

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

  const [WeekOrYear, setWeekOrYear] = React.useState('Year')
  const [Year, setYear] = React.useState('2324')
  const [Week, setWeek] = React.useState(1)

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

  // const [cottonSalesPropertiesArray, setCottonSalesPropertiesArray] = React.useState(["october_sales", "december_sales", "march_sales", "may_sales", "july_sales"])
  // const [cottonPurchasesPropertiesArray, setCottonPurchasesPropertiesArray] = React.useState(["october_purchases", "december_purchases", "march_purchases", "may_purchases", "july_purchases"])
  // const [cottonNamesArray, setCottonNamesArray] = React.useState(["October", "December", "March", "May", "July"])

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

  const [commitmentWeekOrYear, setCommitmentWeekOrYear] = React.useState('Year')
  const [commitmentYear, setCommitmentYear] = React.useState(2023)
  const [commitmentWeek, setCommitmentWeek] = React.useState(1)

  // const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(["specs_net"])
  // const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(["Specs Net"])

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

  const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = React.useState(new Date('2000-01-01').toISOString())
  const [selectedSupplyAndDemandStartDateYear, setSelectedSupplyAndDemandStartDateYear] = React.useState('2000')
  const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = React.useState(new Date('2023-12-31').toISOString())
  const [selectedSupplyAndDemandEndDateYear, setSelectedSupplyAndDemandEndDateYear] = React.useState('2023')
  const [selectedSupplyAndDemandSeason, setSelectedSupplyAndDemandSeason] = React.useState('20/21')

  // const [supplyAndDemandPropertiesArray, setSupplyAndDemandPropertiesArray] = React.useState(["production_usda"])
  // const [supplyAndDemandNamesArray, setSupplyAndDemandNamesArray] = React.useState(["Production USDA"])
  // const [supplyAndDemandProjectedPropertiesArray, setSupplyAndDemandProjectedPropertiesArray] = React.useState(["production_usda", "production_eap"])
  // const [supplyAndDemandProjectedNamesArray, setSupplyAndDemandProjectedNamesArray] = React.useState(["Production USDA", "Production EAP"])

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

  const [season1, setSeason1] = React.useState('')
  const [season2, setSeason2] = React.useState('')
  const [season3, setSeason3] = React.useState('')

  const [contract1, setContract1] = React.useState('')
  const [contract2, setContract2] = React.useState('')
  const [contract3, setContract3] = React.useState('')

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

  // const [staticMonthlyIndexData, setStaticMonthlyIndexData] = React.useState(JSON.parse(monthlyIndexData))
  // const [staticSeasonalIndexData, setStaticSeasonalIndexData] = React.useState(JSON.parse(seasonalIndexData))
  // const [staticCTZ23Data, setStaticCTZ23Data] = React.useState(JSON.parse(CTZ23Data))

  const TemplateModule = ({ module, moduleIndex }) => {
    const { data: session } = useSession()

    const hasSibling = false
    // if (moduleIndex < templateArray?.length - 2) {
    //   hasSibling = templateArray[moduleIndex + 1]?.width != 4
    // }

    switch (module.title) {
      case 'Macrovesta Index':
        return (
          <>
            <div className="col-span-2 relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
              <div className="text-center font-semibold text-xl">
                The Macrovesta Index {session?.user.id}
              </div>
              <div className="flex justify-around gap-8">
                <div className="relative">
                  <InfoButton text={'The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. '} />

                  <div className="text-center font-semibold">
                    Monthly Index
                  </div>
                  <div className="justify-self-end">
                    {/* <SemiCircleDial value={parseFloat(staticMonthlyIndexData.probability_rate) * (staticMonthlyIndexData.inverse_month == "Y" ? -1 : 1)} /> */}
                    <SemiCircleDial value={parseFloat(JSON.parse(monthlyIndexData).probability_rate) * (JSON.parse(monthlyIndexData).inverse_month == 'Y' ? -1 : 1)} />
                  </div>

                </div>
                <div className="relative flex flex-col justify-between">
                  <InfoButton text={'The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. 	The Macrovesta Seasonal Index gives you the percentage likelihood of the current season to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. '} />

                  <div className="text-center font-semibold">
                    Seasonal Index
                  </div>
                  <div className="justify-self-end">
                    {/* <SemiCircleDial value={parseFloat(staticSeasonalIndexData.probability_rate) * (staticSeasonalIndexData.inverse_year == "Y" ? -1 : 1)} /> */}
                    <SemiCircleDial value={parseFloat(JSON.parse(seasonalIndexData).probability_rate) * (JSON.parse(seasonalIndexData).inverse_year == 'Y' ? -1 : 1)} />
                  </div>
                </div>

              </div>
            </div>
          </>
        )

      case 'Conclusion Of Market Report':
        return (
          <>
            <div className="col-span-2 relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
              <InfoButton text={'A quick shortcut to our latest market report as well as the conclusion of the report. '} />
              <div className="grid grid-cols-1">
                <div className="relative flex flex-col gap-y-6 items-center px-8">
                  <div className="text-left font-semibold text-lg">Conclusion of latest market report</div>
                  <div>{JSON.parse(conclusionData)?.text}</div>
                  <a href={JSON.parse(cottonReportURLData).find((report) => report.language == currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language == 'en')?.url} className="px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer">Cotton Market Report Link</a>
                </div>
              </div>
            </div>
          </>
        )

      case 'Cotton Contracts':
        // const [contractParameter, setContractParameter] = React.useState("close")
        // const [contractParameterName, setContractParameterName] = React.useState("Close")

        return (
          <>
            <div className="col-span-2 flex flex-col">
              <div className="grid grid-cols-2 auto-row-[300px] gap-x-8 gap-y-4 pb-12 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-4 py-2">
                <div className="flex col-span-2 gap-x-8 mx-8 mt-4">
                  <div className="mb-4 w-full">
                    <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsStartDate} date={selectedCottonContractsStartDate} formatter={formatter} />
                  </div>
                  <div className="mb-4 w-full">
                    <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsEndDate} date={selectedCottonContractsEndDate} formatter={formatter} />
                  </div>
                </div>
                <div className="relative flex flex-col col-span-2 items-center">
                  <InfoButton text={'This section analyses technically what has happened to the front month of cotton as well as relevant futures spreads over the past week.'} />
                  <div className="mt-6 -mb-2 font-semibold">CTZ23</div>
                  <LineGraph verticalTooltip={true} data={contractParameter != null ? [{ name: 'CTZ23', data: JSON.parse(CTZ23Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), noCircles: true, noHover: true }] : []} monthsTicks={6} xValue="datetime" yValue={contractParameter} graphWidth={1000} graphHeight={400} />
                  {/* <LineGraph verticalTooltip={true} data={contractParameter != null ? [{ name: "CTZ23", data: staticCTZ23Data.filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), noCircles: true, noHover: true }] : []} monthsTicks={6} xValue="datetime" yValue={contractParameter} graphWidth={1000} graphHeight={400} /> */}
                  <div className="flex justify-center mt-8">
                    <div className="w-[200px]">
                      <SingleSelectDropdown
                        options={[{ name: 'Open', parameter: 'open' }, { name: 'Close', parameter: 'close' }, { name: 'High', parameter: 'high' }, { name: 'Low', parameter: 'low' }]}
                        label="Parameter"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => { setContractParameter(e.parameter); setContractParameterName(e.name) }}
                        placeholder="Select Parameter"
                        searchPlaceholder="Search Parameter"
                        includeLabel={false}
                        defaultValue={contractParameterName ?? 'Close'}
                      />
                    </div>
                  </div>
                  <Comments styling="mt-8 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Current Contract')} session={session} section="Current Contract" commentLength={800} />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTH24 Spread</div>
                  <LineGraph verticalTooltip={true} data={calculateSpread(JSON.parse(CTZ23Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTH24Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTH24 Spread')} monthsTicks={6} />
                  <Comments styling="mt-8 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Nearby Spread')} session={session} section="Nearby Spread" />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTK24 Spread</div>
                  <LineGraph verticalTooltip={true} data={calculateSpread(JSON.parse(CTZ23Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTK24Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTK24 Spread')} monthsTicks={6} />
                  <Comments styling="mt-8 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Second Spread')} session={session} section="Second Spread" />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTN24 Spread</div>
                  <LineGraph verticalTooltip={true} data={calculateSpread(JSON.parse(CTZ23Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTN24Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTN24 Spread')} />
                  <Comments styling="mt-8 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Third Spread')} session={session} section="Third Spread" />
                </div>
                <div className="relative flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTZ24 Spread</div>
                  <LineGraph verticalTooltip={true} data={calculateSpread(JSON.parse(CTZ23Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTZ24Data).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTZ24 Spread')} />
                  <Comments styling="mt-8 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Fourth Spread')} session={session} section="Fourth Spread" />
                </div>
              </div>
            </div>
          </>
        )

      case 'Domestic Prices':
        const [indexPropertiesArray, setIndexPropertiesArray] = React.useState(['a_index', 'ice_highest_open_interest_17_months'])
        const [indexNamesArray, setIndexNamesArray] = React.useState(['A-Index', 'Ice Highest'])

        return (
          <>
            <div className="relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">

              <div className="relative grid grid-cols-2">
                <InfoButton text={'In this section, you can use the multi-select dropdown menu to pick which markets you would like to compare. At the moment, the markets available are MCX (Indian), CEPEA (Brazilian), CC-Index (China), and ICE (American). The A-INDEX is intended to be representative of the level of offering prices on the international raw cotton market. It is an average of the cheapest five quotations from a selection of the principal upland cottons traded internationally.'} />
                <div className="col-span-2 text-center text-xl font-semibold mb-4">
                  Domestic Prices
                </div>
                <div className="col-span-2 grid grid-cols-2 w-full gap-x-4 px-8">
                  <div className="mb-4 w-full">
                    <DateField yearOptions={[-28, 0]} label='Start Date' setDate={setSelectedIndexStartDate} date={selectedIndexStartDate} formatter={formatter} />
                  </div>
                  <div className="mb-4 w-full">
                    <DateField yearOptions={[-28, 0]} label='Start Date' setDate={setSelectedIndexEndDate} date={selectedIndexEndDate} formatter={formatter} />
                  </div>

                  <div className="col-span-2 mb-4 w-full">

                    <MultipleSelectDropdown
                      options={[{ property: 'a_index', name: 'A-Index' }, { property: 'ice_highest_open_interest_17_months', name: 'Ice Highest' }, { property: 'cc_index', name: 'CC Index' }, { property: 'mcx', name: 'MCX' }, { property: 'cepea', name: 'CEPEA' }]}
                      variable="name"
                      colour="bg-deep_blue"
                      label="Variables"
                      onSelectionChange={(e) => { if (e.length > 0) { setIndexPropertiesArray(e.map((selection) => selection.property)); setIndexNamesArray(e.map((selection) => selection.name)) } }}
                      placeholder="Select Variables"
                      searchPlaceholder="Search Variables"
                      includeLabel={false}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center w-full">
                  <div className="mt-6 -mb-2 font-semibold">Domestic Prices by Week</div>
                  <div className="mb-4 w-full">

                    <LineGraph showPositiveSign={false} verticalTooltip={true} data={getAIndexData(clientAIndexData.filter((data) => data.date < selectedIndexEndDate && data.date > selectedIndexStartDate), indexPropertiesArray, indexNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" />
                  </div>

                </div>
              </div>
              <Comments styling="px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'A-Index')} session={session} section="A-Index" />
            </div>
          </>
        )

      case 'Market Sentiment':
        return (
          <>
            {((session?.submittedSurvey == true) || ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1))) && (
              <div className="relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">
                {(currentStage == 0) && ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1)) && (session?.submittedSurvey != true) && (
                  <>
                    <InfoButton text={'Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. We ask for their expectations for week’s high, low, intraday moving average in points and open interest for futures only. '} />
                    <div className="grid grid-cols-2">
                      <div className="col-span-2 mb-4 text-center text-xl font-semibold">Weekly Macrovesta Sentiment Survey</div>
                      <div className="col-span-2 grid grid-cols-2 gap-x-4 pl-4">

                      </div>
                      <form className="mt-4 mb-4 pl-4 grid grid-cols-2 col-span-2 gap-x-4 w-full" onSubmit={handleSentimentFormSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="bullishbearish"
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            What is your feeling of the market?
                          </label>
                          <input
                            type="number"
                            step="1"
                            min={-5}
                            max={5}
                            id="bullishbearish"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="From -5 to 5"
                          />
                          <div className="pl-3 text-sm">-5 for very bearish, 0 for neutral and 5 for very bullish</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="font-semibold leading-4 mb-3">Please submit your guesstimates to view the unanimous opinions of our other partners</div>
                          <div className="text-sm leading-4">This new feature displays unanimously the opinion of our partners about December 2023 Futures for the week ahead, offering a view of market sentiment for both short and long-term seasonal trends in the cotton industry.</div>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="high"
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            High
                          </label>
                          <input
                            type="number"
                            step=".01"
                            id="high"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your estimate"
                          />
                          <div className="pl-3 text-sm">Last week's estimates average was {(transformSurveyData(sentimentData, 'high')?.find((group) => group.name == 'Average')?.data[transformSurveyData(sentimentData, 'high')?.find((group) => group.name == 'Average')?.data?.length - 2]?.value)?.toFixed(2)}</div>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="low"
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            Low
                          </label>
                          <input
                            type="number"
                            step=".01"
                            id="low"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your estimate"
                          />
                          <div className="pl-3 text-sm">Last week's estimates average was {(transformSurveyData(sentimentData, 'low')?.find((group) => group.name == 'Average')?.data[transformSurveyData(sentimentData, 'low')?.find((group) => group.name == 'Average')?.data?.length - 2]?.value)?.toFixed(2)}</div>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="intraday"
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            Intraday Average in Points
                          </label>
                          <input
                            type="number"
                            step=".01"
                            id="intraday"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your estimate"
                          />
                          <div className="pl-3 text-sm">Last week's estimates average was {(transformSurveyData(sentimentData, 'intraday_average_points')?.find((group) => group.name == 'Average')?.data[transformSurveyData(sentimentData, 'intraday_average_points')?.find((group) => group.name == 'Average')?.data?.length - 2]?.value)?.toFixed(0)}</div>
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="open_interest"
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            Open Interest (Futures only)
                          </label>
                          <input
                            type="number"
                            step=".01"
                            id="open_interest"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your estimate"
                          />
                          <div className="pl-3 text-sm">Last week's estimates average was {(transformSurveyData(sentimentData, 'open_interest')?.find((group) => group.name == 'Average')?.data[transformSurveyData(sentimentData, 'open_interest')?.find((group) => group.name == 'Average')?.data?.length - 2]?.value)?.toFixed(0)}</div>
                        </div>

                        <div className="col-span-2 flex justify-center">

                          <FormSubmit errorMessage={sentimentError_Message} warningMessage={sentimentWarning_Message} submitted={sentimentSubmitted} submitting={sentimentSubmitting} warningSubmit={sentimentWarningSubmit} />
                        </div>
                      </form>
                    </div>
                  </>
                )}
                {((currentStage == 1) || (session?.submittedSurvey === true)) && (
                  <>
                    <InfoButton text={'Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. Our system calculates an average of inputs for each different category: bullish, neutral and bearish. '} />
                    <div className="grid grid-cols-2 mb-12">
                      <div className="col-span-2 text-center text-xl font-semibold mb-4">
                        Sentiment Survey Results
                      </div>
                      <div className="col-span-2 flex flex-col items-center">
                        <div className="flex justify-center font-semibold">
                          Disclaimer
                        </div>
                        <div className="pl-20 pr-16 mt-6">
                          We understand the importance of privacy and confidentiality. Rest assured that when you submit information or interact with our platform, your data remains anonymous and we uphold strict safeguards to protect your privacy. We do not share any personal data, individually identifiable information, or user submissions with any third parties.
                        </div>
                        <div className="bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200 mt-8">
                          Privacy Policies
                        </div>
                      </div>
                      <div className="col-span-2 grid grid-cols-2">
                        <div className="flex flex-col items-center">
                          <div className="font-semibold">Market Sentiment Distribution</div>
                          <BullishBearishDonut Bullish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish == 'Bullish' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} Bearish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish == 'Bearish' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} Neutral={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish == 'Neutral' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} />
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="font-semibold mb-20">Market Sentiment Strength</div>

                          <SemiCircleDial value={averageMarketSentiment()} rangeStart={-5} rangeEnd={5} arcAxisText={['-5', '-3', '0', '3', '5']} leftText="Bearish" rightText="Bullish" decimals={1} />
                        </div>

                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mt-6 -mb-2 font-semibold">High</div>
                        <LineGraph lineLimit={5} data={transformSurveyData(sentimentData, 'high')} monthsTicks={1} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mt-6 -mb-2 font-semibold">Low</div>
                        <LineGraph lineLimit={5} data={transformSurveyData(sentimentData, 'low')} monthsTicks={1} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mt-6 -mb-2 font-semibold">Intraday Average in Points</div>
                        <LineGraph decimalPlaces={0} lineLimit={5} data={transformSurveyData(sentimentData, 'intraday_average_points')} monthsTicks={1} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mt-6 -mb-2 font-semibold">Open Interest</div>
                        <LineGraph decimalPlaces={0} lineLimit={5} data={transformSurveyData(sentimentData, 'open_interest', 0)} monthsTicks={1} />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-between px-8">
                  {currentStage == 0 && (
                    <div></div>
                  )}
                  {currentStage > 0 && (
                    <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={goPrevious}>Previous</button>
                  )}
                  {currentStage < (stages.length - 1) && sentimentSubmitted && session?.submittedSurvey == false && (
                    <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={goNext}>Next</button>
                  )}
                </div>
              </div>
            )}
            {((session?.submittedSurvey != true) && ((todaysDate.getDay() != 0) && (todaysDate.getDay() != 1))) && (
              <div className="relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <div className="relative w-full text-center col-span-2 mb-4 text-xl font-semibold">
                  <InfoButton text={'Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. We ask for their expectations for week’s high, low, intraday moving average in points and open interest for futures only. '} />
                  Weekly Macrovesta Sentiment Survey
                </div>
                <div className="px-8">
                  You did not fill in the survey sentiment this week on Sunday or Monday and therefore cannot view the results for this week.
                  Please fill it out next week if you would like to see the results.
                </div>
              </div>
            )}
          </>
        )

      case 'News Snapshot':
        return (
          <>
            <div className="col-span-2 flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg ">
              <div className="flex justify-around gap-8">
                <div className="relative w-full text-center font-semibold text-xl">
                  <InfoButton text={'Find a summarised list of events which have happened over the past weeks.  '} />
                  Recent Events
                </div>
                <div className="relative w-full text-center font-semibold text-xl">
                  <InfoButton text={'Find a list of future considerations for the cotton industry, divided into short and long term. '} />
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
                  {JSON.parse(snapshotsData).filter((object: any, index: number) => object.news_type == 'Recent Events').filter((object: any, index: number) => index < 8).map((snapshot, index) => (
                    <>
                      {index == 0 && (
                        <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4" onClick={() => setSnapshotPopup(snapshot)}>
                          <img className="w-[150px] h-[150px] aspect-square object-cover rounded-lg" src={snapshot?.image_of_snapshot_strategy != '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'} />
                          <div className="flex flex-col w-full">
                            <div className="grid grid-cols-[auto_75px]">
                              <div className="font-semibold">
                                {snapshot.title_of_snapshot_strategy}
                              </div>
                              <div className="w-[75px]">
                                {parseDateString(snapshot.date_of_snapshot_strategy)}
                              </div>
                            </div>
                            <div className="text-sm pt-2">{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
                          </div>
                        </div>
                      )}
                      {index != 0 && (
                        <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                          {snapshot.title_of_snapshot_strategy}
                        </div>
                      )}
                    </>
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
                  {JSON.parse(snapshotsData).filter((object: any, index: number) => (object.news_type == 'Short Term' || object.news_type == 'Long Term')).filter((object: any, index: number) => index < 8).sort((a, b) => { if (a.news_type < b.news_type) return 1; if (a.news_type > b.news_type) return -1; return 0 }).map((snapshot, index) => (
                    // <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full h-fit py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                    //   <div>
                    //     {snapshot.title_of_snapshot_strategy}
                    //   </div>
                    //   <div className="min-w-[80px]">
                    //     {snapshot.news_type}
                    //   </div>
                    // </div>
                    <>
                      {index == 0 && (
                        <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4" onClick={() => setSnapshotPopup(snapshot)}>
                          <img className="w-[150px] h-[150px] aspect-square object-cover rounded-lg" src={snapshot?.image_of_snapshot_strategy != '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'} />
                          <div className="flex flex-col w-full">
                            <div className="grid grid-cols-[auto_75px]">
                              <div className="font-semibold">
                                {snapshot.title_of_snapshot_strategy}
                              </div>
                              <div className="w-[75px]">
                                {parseDateString(snapshot.date_of_snapshot_strategy)}
                              </div>
                            </div>
                            <div className="text-sm pt-2">{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
                          </div>
                        </div>
                      )}
                      {index != 0 && (
                        <div className="border grid grid-cols-[auto_100px] hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                          <div>
                            {snapshot.title_of_snapshot_strategy}
                          </div>
                          <div>
                            {snapshot.news_type}
                          </div>
                        </div>
                      )}
                    </>
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
                                onSelectionChange={(e) => { setSelectedNewsType(e.value); setSelectedNewsTypeName(e.name) }}
                                placeholder="Select Snapshot Type"
                                searchPlaceholder="Search Types"
                                includeLabel={false}
                                defaultValue={selectedNewsTypeName ?? ''}
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
          </>
        )

      case 'Basis Cost':
        return (
          <>
            <div className="col-span-2 grid grid-cols-2 bg-[#ffffff] p-4 rounded-xl shadow-lg  ">
              <div className="col-span-2 flex pl-12 items-center justify-left gap-2 w-full">
                <div className="mr-2">
                  Select Cost Type:
                </div>
                <div className={`${selectedCostType == 'FOB' ? ' bg-deep_blue text-white shadow-md' : 'bg-white text-black shadow-center-md'} w-fit  px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200`} onClick={() => setSelectedCostType('FOB')}>
                  FOB
                </div>
                <div className={`${selectedCostType == 'CNF' ? ' bg-deep_blue text-white shadow-md' : 'bg-white text-black shadow-center-md'} w-fit  px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200`} onClick={() => setSelectedCostType('CNF')}>
                  CNF
                </div>
              </div>
              <div className="relative flex flex-col items-center">
                {/* <div className='absolute top-2 right-2 remove-me group' >

                  <img className=' w-[15px] h-[15px] self-center opacity-100 group-hover:hidden' width="15" height="15" src={"/i_G_SQ.png"}></img>
                  <img className=' w-[15px] h-[15px] self-center opacity-100 hidden group-hover:block' width="15" height="15" src={"/i.png"}></img>
                  <div className="z-50 pointer-events-none absolute flex flex-col justify-end left-1/2 w-[300px] h-[600px] -translate-x-full -translate-y-[615px] invisible group-hover:visible origin-bottom-right scale-0 group-hover:scale-100 transition-all duration-300 ">
                    <div className="shadow-center-2xl flex flex-col items-center px-4 pt-2 pb-4 rounded-2xl bg-deep_blue text-white text-center text-xs">
                      <img className="opacity-70" width="30px" src="/i_White.png" />
                      <div className="mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                      </div>
                    </div>
                  </div>
                </div> */}
                <InfoButton text={'Find the most update FOB & CNF costs for different origins. For CNF we are always considering the same origin and same destination (main far east ports). '} />
                <div className="text-center font-semibold text-xl">Current Basis Cost</div>
                <GroupedBarChart data={basisBarChartData(JSON.parse(basisData).filter((basis) => basis.cost_type == selectedCostType))} />
              </div>
              <div className="relative flex flex-col items-center">
                <InfoButton text={'Find the historical basis cost for both FOB and CNF. '} />
                <div className="-mb-2 text-center font-semibold text-xl">Historical Basis Cost</div>
                <LineGraph decimalPlaces={0} verticalTooltip={true} data={transformData(JSON.parse(basisData).filter((basis) => (basis.country == basisCountry) && (basis.cost_type == selectedCostType)))} xValue="time" yValue="value" monthsTicks={6} />
              </div>
              <div className="col-span-2 grid grid-cols-2 mb-4">
                <div className="grid place-content-center">
                  {(session?.role == 'partner' || session?.role == 'admin') && (
                    <div className="bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenBasisCostForm(true)}>
                      Add Basis Cost Estimate
                    </div>
                  )}
                  {openBasisCostForm && (
                    <div className='absolute modal left-0 top-0 z-40'>
                      <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                          <div className="my-4 font-semibold text-lg">
                            Add Basis Cost Estimate
                          </div>
                          <div className="w-full">
                            <div className="flex flex-col gap-4">
                              <SingleSelectDropdown
                                options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'WAF' }, { country: 'Australia' }]}
                                label="Country"
                                variable="country"
                                colour="bg-deep_blue"
                                onSelectionChange={(e) => { setSelectedCountry(e.country) }}
                                placeholder="Select Country"
                                searchPlaceholder="Search Countries"
                                includeLabel={false}
                                defaultValue={selectedCountry ?? ''}
                              />
                              <SingleSelectDropdown
                                options={[{ value: 'FOB' }, { value: 'CNF' }]}
                                label="cost_type"
                                variable="value"
                                colour="bg-deep_blue"
                                onSelectionChange={(e) => setSelectedFormCostType(e.value)}
                                placeholder="Select cost type"
                                searchPlaceholder="Search cost types"
                                includeLabel={false}
                                defaultValue={selectedFormCostType ?? ''}
                              />
                            </div>
                            <form className="mt-4 mb-4  grid grid-cols-2 gap-x-4 w-full" onSubmit={handleBasisFormSubmit}>
                              <div className="mb-4">
                                <label
                                  htmlFor="ctz23"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                >
                                  CTZ23 Basis Estimate
                                </label>
                                <input
                                  type="number"
                                  id="ctz23"
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />
                              </div>
                              <div className="mb-4">
                                <label
                                  htmlFor="ctz24"
                                  className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                >
                                  CTZ24 Basis Estimate
                                </label>
                                <input
                                  type="number"
                                  id="ctz24"
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                  placeholder="Enter your estimate"
                                />
                              </div>

                              <div className="col-span-2 flex justify-center">
                                {/* <button
                                type="submit"
                                className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                              >
                                Submit
                              </button> */}
                                <FormSubmit errorMessage={error_Message} warningMessage={warning_Message} submitted={submitted} submitting={submitting} warningSubmit={warningSubmit} />
                              </div>
                            </form>
                          </div>
                        </div>
                        <div onClick={() => setOpenBasisCostForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <div className="w-[200px]">
                    <SingleSelectDropdown
                      options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'WAF' }, { country: 'Australia' }]}
                      label="Country"
                      variable="country"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setBasisCountry(e.country)}
                      placeholder="Select Country"
                      searchPlaceholder="Search Countries"
                      includeLabel={false}
                      defaultValue={basisCountry ?? 'Brazil'}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Recent Basis')} session={session} section="Recent Basis" />
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Historical Basis')} session={session} section="Historical Basis" />
              </div>
            </div>
          </>
        )

      case 'US Export Sales':

        const [exportPropertiesArray, setExportPropertiesArray] = React.useState(['net_sales', 'next_marketing_year_net_sales'])
        const [exportNamesArray, setExportNamesArray] = React.useState(['Net Sales', 'Next Marketing Year Net Sales'])

        return (
          <>
            <div className={`relative flex flex-col ${hasSibling ? 'col-span-1' : 'col-span-2'} bg-[#ffffff] p-4 rounded-xl shadow-lg`}>
              <div className="relative grid grid-cols-2">
                <InfoButton text={`Weekly exports, accumulated exports, net sales, and outstanding sales for the current marketing year and net sales and outstanding sales for next marketing year are available for cotton since 1990.
U.S Export Sales Report is released every Thursday and highlights data as of the week before, also ending on Thursday. 
`} />
                <div className="col-span-2 text-center text-xl font-semibold mb-4">
                  US Exports Sales
                </div>
                <div className="col-span-2 grid grid-cols-2 w-full gap-x-4 px-8">
                  <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedStartDate} date={selectedStartDate} formatter={formatter} />
                  </div>
                  <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedEndDate} date={selectedEndDate} formatter={formatter} />
                  </div>
                  <div className="col-span-2 mb-4 w-full">

                    <MultipleSelectDropdown
                      options={[{ property: 'weekly_exports', name: 'Weekly Exports' }, { property: 'accumulated_exports', name: 'Accumulated Exports' }, { property: 'net_sales', name: 'Net Sales' }, { property: 'next_marketing_year_net_sales', name: 'Next Marketing Year Net Sales' }, { property: 'outstanding_sales', name: 'Outstanding Sales' }, { property: 'next_marketing_year_outstanding_sales', name: 'Next Marketing Year Outstanding Sales' }]}
                      variable="name"
                      colour="bg-deep_blue"
                      label="Variables"
                      onSelectionChange={(e) => { if (e.length > 0) { setExportPropertiesArray(e.map((selection) => selection.property)); setExportNamesArray(e.map((selection) => selection.name)) } }}
                      placeholder="Select Variables"
                      searchPlaceholder="Search Variables"
                      includeLabel={false}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center w-full">
                  <div className="mt-6 -mb-2 font-semibold">US Export Sales by Week</div>
                  <div className="mb-4 w-full">

                    <LineGraph decimalPlaces={0} verticalTooltip={true} data={getUSExportSalesData(clientUSExportSalesData.filter((data) => data.week_ending < selectedEndDate && data.week_ending > selectedStartDate), exportPropertiesArray, exportNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" />
                  </div>

                </div>
              </div>
              <Comments styling="px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Export Sales')} session={session} section="Export Sales" commentLength={800} />
            </div>
          </>
        )

      case 'In Country News':

        return (
          <>
            <div className={`relative flex flex-col bg-[#ffffff] ${hasSibling ? 'col-span-1' : 'col-span-2'} p-4 rounded-xl shadow-lg`}>
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
                  defaultValue={countryNewsFilter ?? 'All Countries'}
                />
              </div>
              <div className="flex flex-col justify-around items-start gap-4 mt-4">
                {JSON.parse(countryNewsData).filter((object) => countryNewsFilter != 'Select Country' && countryNewsFilter != 'All Countries' ? object?.country == countryNewsFilter : true).filter((object: any, index: number) => index < 10).map((news, index) => (
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
                              defaultValue={countryNewsFormCountry ?? ''}
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
          </>
        )

      case 'Cotton On Call':

        const [cottonSalesPropertiesArray, setCottonSalesPropertiesArray] = React.useState(['october_sales', 'december_sales', 'march_sales', 'may_sales', 'july_sales'])
        const [cottonPurchasesPropertiesArray, setCottonPurchasesPropertiesArray] = React.useState(['october_purchases', 'december_purchases', 'march_purchases', 'may_purchases', 'july_purchases'])
        const [cottonNamesArray, setCottonNamesArray] = React.useState(['October', 'December', 'March', 'May', 'July'])

        return (
          <>
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">

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
                        defaultValue={WeekOrYear ?? 'Year'}
                      />
                    </div>
                    {WeekOrYear == 'Year' && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(clientCottonOnCallData, 'season')}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue={String(Year) ?? '2324'}
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
                            defaultValue={String(Week) ?? '32'}
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
                        placeholder="Select Variables"
                        searchPlaceholder="Search Variables"
                        includeLabel={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col items-center">

                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Sales by week</div>
                      <div className="mb-16 w-full">

                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), cottonSalesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Sales" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Sales by year</div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), cottonSalesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">

                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Purchases by week</div>
                      <div className="mb-16 w-full">

                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), cottonPurchasesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Purchases" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Purchases by year</div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), cottonPurchasesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Purchases" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">

                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total on call sales and purchases by week</div>
                      <div className="mb-16 w-full">

                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Total" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total on call sales and purchases by year</div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week == Week), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Total" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative flex flex-col items-center">

                  {WeekOrYear == 'Year' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total net U OC position by week</div>
                      <div className="mb-16 w-full">

                        <LineGraph decimalPlaces={0} weekNumberTicks={true} data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season == Year), ['total_net_u_oc_position'], ['Total Net U OC Position'])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Net" />
                      </div>
                    </>
                  )}
                  {WeekOrYear == 'Week' && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Total net U OC position by year</div>
                      <div className="mb-16 w-full">

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
          </>
        )

      case 'Commitment Of Traders':

        const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(['specs_net'])
        const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(['Specs Net'])

        return (
          <>
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">

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
                      defaultValue={commitmentWeekOrYear ?? 'Year'}
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
                          defaultValue={String(commitmentYear) ?? '2023'}
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
                          defaultValue={String(commitmentWeek) ?? '1'}
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
          </>
        )

      case 'Supply And Demand':

        const [supplyAndDemandPropertiesArray, setSupplyAndDemandPropertiesArray] = React.useState(['production_usda'])
        const [supplyAndDemandNamesArray, setSupplyAndDemandNamesArray] = React.useState(['Production USDA'])
        const [supplyAndDemandProjectedPropertiesArray, setSupplyAndDemandProjectedPropertiesArray] = React.useState(['production_usda', 'production_eap'])
        const [supplyAndDemandProjectedNamesArray, setSupplyAndDemandProjectedNamesArray] = React.useState(['Production USDA', 'Production EAP'])

        return (
          <>
            <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg">

              <div className="grid grid-cols-2 -mb-8">
                <div className="relative col-span-2 text-center text-xl font-semibold mb-4">
                  {/* <InfoButton text={`The World Agricultural Supply and Demand Estimates (WASDE) is released monthly and provides annual forecasts for supply and use of U.S. and world cotton. `} /> */}
                  Supply and Demand
                </div>
                <div className="col-span-3 grid grid-cols-3 w-full gap-x-4 px-8">

                  <div className="mb-4 w-full">
                    <SingleSelectDropdown
                      options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 0, 1).toISOString() }))}
                      label="Week"
                      variable="year"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => { setSelectedSupplyAndDemandStartDate(e.value); setSelectedSupplyAndDemandStartDateYear(e.year) }}
                      placeholder="Select year"
                      searchPlaceholder="Search Options"
                      includeLabel={false}
                      defaultValue={selectedSupplyAndDemandStartDateYear ?? '2000'}
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <SingleSelectDropdown
                      options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 12, 31).toISOString() }))}
                      label="Week"
                      variable="year"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => { setSelectedSupplyAndDemandEndDate(e.value); setSelectedSupplyAndDemandEndDateYear(e.year) }}
                      placeholder="Select year"
                      searchPlaceholder="Search Options"
                      includeLabel={false}
                      defaultValue={selectedSupplyAndDemandEndDateYear ?? '2023'}
                    />
                  </div>
                  <div className="mb-4 w-full">

                    <MultipleSelectDropdown
                      options={[{ property: 'beginning_stocks_usda', name: 'Beginning Stocks' }, { property: 'production_usda', name: 'Production' }, { property: 'imports_usda', name: 'Imports' }, { property: 'domestic_use_usda', name: 'Domestic Use' }, { property: 'exports_usda', name: 'Exports' }, { property: 'ending_stocks_usda', name: 'Ending Stocks' }]}
                      variable="name"
                      colour="bg-deep_blue"
                      label="Variables"
                      onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandPropertiesArray(e.map((selection) => selection.property)); setSupplyAndDemandNamesArray(e.map((selection) => selection.name)) } }}
                      placeholder="Select Variables"
                      searchPlaceholder="Search Variables"
                      includeLabel={false}
                    />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col items-center">

                  <div className="relative w-full text-center mt-6 -mb-2 font-semibold">
                    <InfoButton text={'The World Agricultural Supply and Demand Estimates (WASDE) is released monthly and provides annual forecasts for supply and use of U.S. and world cotton. '} />
                    Historical WASDE
                  </div>
                  <div className="mb-16 w-full">
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
                        defaultValue={selectedSupplyAndDemandSeason ?? '22/23'}
                      />
                    </div>
                    <div className="mb-4 w-full">

                      <MultipleSelectDropdown
                        options={[{ property: 'beginning_stocks', name: 'Beginning Stocks' }, { property: 'production', name: 'Production' }, { property: 'imports', name: 'Imports' }, { property: 'domestic_use', name: 'Domestic Use' }, { property: 'exports', name: 'Exports' }, { property: 'ending_stocks', name: 'Ending Stocks' }]}
                        variable="name"
                        colour="bg-deep_blue"
                        label="Variables"
                        onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandProjectedPropertiesArray(e.reduce((acc, obj) => { acc.push(`${obj.property}_usda`); acc.push(`${obj.property}_eap`); return acc }, [])); setSupplyAndDemandProjectedNamesArray(e.reduce((acc, obj) => { acc.push(`${obj.name} USDA`); acc.push(`${obj.name} EAP`); return acc }, [])) } }}
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
                </div>
              </div>
              <div className="col-span-1">
                <Comments styling="mt-2 px-8" comments={JSON.parse(commentsData).filter((comment) => comment.section == 'Supply And Demand')} session={session} section="Supply And Demand" />
              </div>
            </div>
          </>
        )

      case 'Future Contracts':
        return (
          <>
            <div className="col-span-2 flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg pb-12">
              <div className="relative w-full text-center text-xl font-semibold mt-4">
                <InfoButton text={'A historical look into the December futures contract. '} />
                Future Contracts Study
              </div>
              <LineGraphNotTime verticalTooltip={false} xDomain1={0} xDomain2={12} data={(contract1 && contract2 && contract3) ? getStudyData(JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract1), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract2), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="col-span-2 text-center text-2xl ">Please Select the Seasons you want to compare</div>
            <div className="col-span-2 grid grid-cols-3 justify-center gap-8 text-xl">
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Contract"
                  variable="year"
                  onSelectionChange={(e) => setContract1(e.year)}
                  placeholder="Select Contract"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract1 ?? 'Z21'}
                />

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
                  defaultValue={contract2 ?? 'Z22'}
                />

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
                  defaultValue={contract3 ?? 'Z23'}
                />
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-x-8">
              <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4">
                <div>Average High (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
                <div>Average Low (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
                <div>Average Price Range (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
                <div>Average High (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
                <div>Average Low (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
                <div>Average Price Range (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
              </div>
            </div>
          </>
        )

      case 'V4':
        return (
          <>
            <div className="col-span-2 flex flex-col items-center bg-[#ffffff] p-4 rounded-xl shadow-lg pb-12">
              <div className="relative w-full text-center text-xl font-semibold mt-4">
                <InfoButton text={'A historical look into different seasons where you can analyse them side-to-side. '} />
                V4
              </div>
              {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
              <LineGraphNotTime verticalTooltip={false} data={(season1 && season2 && season3) ? getSeasonData(JSON.parse(seasonsData).find((season) => season.season == season1), JSON.parse(seasonsData).find((season) => season.season == season2), JSON.parse(seasonsData).find((season) => season.season == season3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="col-span-2 text-center text-2xl">Please Select the Seasons you want to compare</div>
            <div className="col-span-2 grid grid-cols-3 justify-center gap-8 text-xl">
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(seasonsData)}
                  label="Season"
                  variable="season"
                  onSelectionChange={(e) => setSeason1(e.season)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Seasons"
                  includeLabel={false}
                  defaultValue={season1 ?? '2020/2021'}
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
                  defaultValue={season2 ?? '2021/2022'}
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
                  defaultValue={season3 ?? '2022/2023'}
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
          </>
        )

      default:
        return (
          <></>
        )
        break
    }
  }

  const MemoizedTemplateModule = React.memo(TemplateModule)

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
      </Head>
      <main className="main grid grid-cols-[160px_auto] h-screen items-center bg-slate-200">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-20 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Preferences'} urlPath={urlPath} user={session?.user.name} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">
            {/* <DragDrop templatesData={templatesData} /> */}
            <div className="pb-8">
              Macrovesta is being developed to deliver AI-powered cotton market expertise from farmer to retailer. The insights delivered by your personalised dashboard will provide you with the information and context you need to make confident risk and position management decisions. Our artificial intelligence model uses cutting edge technology to generate insights and explain how and why they are important to your business.
            </div>

            <div className="z-50 grid grid-cols-2 gap-8 mx-8">
              {templateArray?.map((templateModule, moduleIndex) => (
                // <MemoizedTemplateModule module={templateModule} moduleIndex={moduleIndex} />
                <TemplateModule module={templateModule} moduleIndex={moduleIndex} />
              ))}
              {/* <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
                <div className="text-center font-semibold text-xl">
                  The Macrovesta Index
                </div>
                <div className="flex justify-around gap-8">
                  <div className="relative">
                    <InfoButton text={`The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. `} />

                    <div className="text-center font-semibold">
                      Monthly Index
                    </div>
                    <div className="justify-self-end">
                      <SemiCircleDial value={25} />
                    </div>

                  </div>
                  <div className="relative flex flex-col justify-between">
                    <InfoButton text={`The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. 	The Macrovesta Seasonal Index gives you the percentage likelihood of the current season to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. `} />

                    <div className="text-center font-semibold">
                      Seasonal Index
                    </div>
                    <div className="justify-self-end">
                      <SemiCircleDial value={40} />
                    </div>
                  </div>

                </div>
              </div> */}
            </div>
          </div>

        </div>
      </main >
    </>
  )
}

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

  const template = await prisma?.dashboard_Templates.findFirst({
    where: {
      company: session?.company
    }
  })

  const templateData = JSON.stringify(template?.data)

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

  // const CTZ23Data = JSON.stringify({ variable: "hello world" })
  // const CTH24Data = JSON.stringify({ variable: "hello world" })
  // const CTK24Data = JSON.stringify({ variable: "hello world" })
  // const CTN24Data = JSON.stringify({ variable: "hello world" })
  // const CTZ24Data = JSON.stringify({ variable: "hello world" })

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

  // const onCall = await prisma?.cotton_on_call.findMany({

  // })

  // const cottonOnCallData = JSON.stringify(onCall)
  const cottonOnCallData = JSON.stringify({ variable: 'hello world' })

  const commitment = await prisma?.commitment_of_traders.findMany({

  })

  const commitmentData = JSON.stringify(commitment)

  // const exportdata = await prisma?.us_export_sales.findMany({})

  // const exportSalesData = JSON.stringify(exportdata)
  const exportSalesData = JSON.stringify({ variable: 'hello world' })

  const supplydemand = await prisma?.supply_and_demand.findMany({
    orderBy: {
      date: 'asc'
    }
  })

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

  // const aIndex = await prisma?.a_index.findMany({})

  // const aIndexData = JSON.stringify(aIndex)
  const aIndexData = JSON.stringify({ variable: 'hello world' })

  // console.log(monthlyIndexData)
  return {
    props: { templateData, monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData, commentsData, cottonOnCallData, commitmentData, exportSalesData, supplyAndDemandData, cottonReportURLData, conclusionData, aIndexData }
  }
}

export default MyDashboard
