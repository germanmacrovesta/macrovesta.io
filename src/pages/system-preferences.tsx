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
import DashboardDragDrop from '../components/dashboardDragDrop'

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

const Home: NextPage = ({ templateData }) => {
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
            <Breadcrumbs title={'Preferences'} urlPath={urlPath} user={session?.user.name} />
            {/* <TabMenu data={TabMenuArray} urlPath={urlPath} /> */}
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className=" bg-slate-200">
            <DashboardDragDrop templateData={JSON.parse(templateData)} />
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

  // const template = await prisma?.report_Templates.findMany({})

  // const templatesData = JSON.stringify(template)

  const template = await prisma?.dashboard_Templates.findFirst({
    where: {
      company: session?.company
    }
  })

  const templateData = JSON.stringify(template?.data)

  // console.log(monthlyIndexData)
  return {
    props: { templateData }
  }
}

export default Home
