import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/router'
import React from 'react'
import SingleSelectDropdown from '../components/singleSelectDropdown'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from '../../public/static/charting_library/charting_library'
import FormSubmit from '../components/formSubmit'
import { useSession, getSession } from 'next-auth/react'
import useWeglotLang from '../components/useWeglotLang'
import InfoButton from '../components/infoButton'
import { parseDateString, getWeekNumber } from '~/utils/dateUtils'
const Home: NextPage = ({ upcomingData }) => {
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

      <main className="main h-full items-center bg-slate-200">

        <div className="flex w-full flex-col self-start">
          <div className="p-6 mx-8 bg-slate-200">
            <div className="flex w-full flex-col self-start">

              <div className=" bg-slate-200">
                <div className="relative flex flex-col bg-[#ffffff] p-8 rounded-xl shadow-lg">
                  <div className="text-center font-semibold text-lg">Planned Changes</div>
                  <ul className="list-disc pl-4">
                    {JSON.parse(upcomingData).map((upcoming) => (
                      <>
                        <li>
                          <div className="font-semibold mb-2">
                            {upcoming.title}
                          </div>
                          <div className="mb-4">
                            {upcoming.text}
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
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

  const upcoming = await prisma?.upcoming_changes.findMany({})
  const upcomingData = JSON.stringify(upcoming)

  return {
    props: { upcomingData }
  }
}

export default Home
