import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import Breadcrumbs from '../components/breadcrumbs'
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

            <div className='relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg'>
              <div className="my-4 font-semibold text-lg text-center">
                Add Suggestion
              </div>
              <div className="w-full">
                <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleSuggestionFormSubmit}>
                  <div className="mb-4">
                    <div className="mb-4">
                      <SingleSelectDropdown
                        options={[{ name: 'General', value: 'General' }, { name: 'Data Visualisation', value: 'Data Visualisation' }, { name: 'Information Request', value: 'Information Request' }, { name: 'Reports', value: 'Reports' }]}
                        label="suggestion_type"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setSelectedSuggestionType(e.value)}
                        placeholder="Select Suggestion Type"
                        searchPlaceholder="Search Types"
                        includeLabel={false}
                      />
                    </div>
                    {/* <label
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
                            /> */}
                  </div>
                  {/* <div className="mb-4">
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
                          </div> */}
                  <div className="mb-4">
                    <label
                      htmlFor="text"
                      className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                    >
                      Suggestion
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
                    <FormSubmit errorMessage={suggestionError_Message} warningMessage={suggestionWarning_Message} submitted={suggestionSubmitted} submitting={suggestionSubmitting} warningSubmit={suggestionWarningSubmit} />
                  </div>
                </form>
              </div>
            </div>
            {/* <div onClick={() => setOpenSuggestionForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div> */}
            {/* </div>
              </div> */}
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

  const upcoming = await prisma?.upcoming_changes.findMany({})
  const upcomingData = JSON.stringify(upcoming)

  return {
    props: { upcomingData }
  }
}

export default Home
