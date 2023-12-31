import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
// import DropdownMenu from "./sortByDropdownMenu";
import { useSession } from 'next-auth/react'
import FormSubmit from './formSubmit'
import SingleSelectDropdown from './singleSelectDropdown'

const Sidebar = (props) => {
  const [openDropdown, setOpenDropdown] = React.useState(false)
  const [newVenue, setNewVenue] = React.useState(null)
  const [venueArray, setVenueArray] = React.useState(null)
  const [selectedVenue, setSelectedVenue] = React.useState(null)

  const { data: session } = useSession()

  const router = useRouter()
  const urlPath = router.asPath
  const splitPath = urlPath.split('/')
  const root = '/' + splitPath[1] + '/' + splitPath[2] + '/' + splitPath[3]
  let active = []
  if (splitPath.length >= 4) {
    active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 4]]
  } else if (splitPath.length >= 3) {
    active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 3]]
  }

  // const handleClick = (e, href) => {
  //     e.preventDefault()
  //     router.push(href)
  // }

  const activeVenue = 'ApplePop'

  // async function changeVenue(venue) {

  //     setNewVenue(venue)

  //     // Get data from the form.
  //     const data = {
  //         id: session.user.id,
  //         venue: venue
  //     }

  //     console.log(data);

  //     // Send the data to the server in JSON format.
  //     const JSONdata = JSON.stringify(data)

  //     // API endpoint where we send form data.
  //     const endpoint = '/api/changeVenue'

  //     // Form the request for sending data to the server.
  //     const options = {
  //         // The method is POST because we are sending data.
  //         method: 'POST',
  //         // Tell the server we're sending JSON.
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         // Body of the request is the JSON data we created above.
  //         body: JSONdata,
  //     }

  //     // Send the form data to our forms API on Vercel and get a response.
  //     const response = await fetch(endpoint, options)

  //     // Get the response data from server as JSON.
  //     // If server returns the name submitted, that means the form works.
  //     const result = await response.json()
  //     // alert(result)
  // }

  // React.useEffect(() => {
  //     if (!session) return;
  //     if (session) {
  //         console.log(session.user.venue_list)
  //         const array = session.user.venue_list.split(',')
  //         setVenueArray(array);
  //         setSelectedVenue(session.user.selected_venue);
  //         console.log(selectedVenue)
  //         console.log(`venueArray is: ${venueArray}`)
  //     }
  // }, [session])

  // let VenueOptions = () => {
  //     return (
  //         <>
  //             {venueArray && venueArray.map((venue, index) => (
  //                 <div key={venue} onClick={() => { changeVenue(venue); setOpenDropdown(false) }} className=" text-center py-1 hover:bg-secondarygrey bg-white">
  //                     {venue}

  //                 </div>
  //             ))}
  //         </>
  //     );
  // };

  const [openBugForm, setOpenBugForm] = React.useState(false)

  const [selectedBugType, setSelectedBugType] = React.useState('')

  const [bugError_Message, setBugError_Message] = React.useState('')
  const [bugSubmitted, setBugSubmitted] = React.useState(false)
  const [bugSubmitting, setBugSubmitting] = React.useState(false)
  const [bugWarning_Message, setBugWarning_Message] = React.useState('')
  const [bugWarningSubmit, setBugWarningSubmit] = React.useState(false)

  const handleBugFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setBugSubmitting(true)

    let bug_type = ''
    const title = e.target.title.value
    const text = e.target.text.value
    // let image = e.target["image"].value;
    let errorMessage = ''
    const warningMessage = ''

    // console.log("textarea", text == "")

    if (selectedBugType != null && selectedBugType != '' && selectedBugType != 'Select Bug Type') {
      bug_type = selectedBugType
    } else {
      errorMessage += 'Please select a bug type. '
    }
    if (title == null || title == '') {
      errorMessage += 'Please enter a title. '
    }
    if (text == null || text == '') {
      errorMessage += 'Please enter a text. '
    }
    // if (image == null || image == "") {
    //     warningMessage += "You can add an image as well. If you don't want to just click confirm. ";
    // }

    // if (warningMessage !== "") {
    //     setBugWarning_Message(warningMessage);
    //     // throw new Error(errorMessage)
    // } else {
    //     if (bugWarning_Message != "") {
    //         setBugWarning_Message("")
    //     }
    // }

    if (errorMessage != '') {
      setBugError_Message(errorMessage)
      setBugWarningSubmit(false)
      setBugSubmitting(false)
    } else {
      if (bugError_Message != '') {
        setBugError_Message('')
      }

      if (bugWarningSubmit == false && warningMessage != '') {
        setBugWarningSubmit(true)
        setBugSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          title,
          text,
          user: session?.user?.name,
          bug_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-bug-report'

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
        const result = await response.json().then(() => { setBugSubmitted(true); setBugSubmitting(false) })
        // setSnapshotSubmitted(true); setSnapshotSubmitting(false)
      }
    }
  }

  return (
    <div className='fixed print:hidden h-screen text-md z-50'>
      <div className='relative z-50 flex flex-col justify-between bg-gradient-to-br from-navy to-deep_blue w-40 h-full px-4 '>
        <div>
          <div className='flex justify-center pt-4 py-4 pb-8'>
            <Link href={{ pathname: '/' }}>
              <div className='flex justify-center w-full'>
                {/* <img className="" width="100%" src="/Full_Logo.svg" /> */}
                {/* <img className="" width="100%" src="/watermark.svg" /> */}
                <img src='/Logo File-14.png' className='object-fill' />

              </div>
            </Link>
          </div>
          <div className='flex flex-col gap-3 justify-center text-white -ml-2  pb-4'>

            <div className={`${(urlPath == '/' || urlPath == '/overview') ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
              {/* <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} /> */}
              {/* <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" /> */}
              <Link href={{ pathname: '/' }}>
                <p className='pl-2 rounded-lg pr-2'>Home</p>
              </Link>
            </div>
            <div className={`${urlPath == '/improvements' ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
              {/* <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} /> */}
              {/* <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" /> */}
              <Link href={{ pathname: '/improvements' }}>
                <p className='pl-2 rounded-lg pr-2'>Improvements</p>
              </Link>
            </div>
            {(session?.tier == 'premium' || session?.type == 'owner') && (
              <>
                <div className={`${urlPath == '/position' ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
                  {/* <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} /> */}
                  {/* <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" /> */}
                  <Link href={{ pathname: '/position' }}>
                    <p className='pl-2 rounded-lg pr-2'>Position</p>
                  </Link>
                </div>
              </>
            )}
            {session?.access_to_marketplace == true && (
              <>
                <div className={`${urlPath == '/marketplace' ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
                  {/* <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} /> */}
                  {/* <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" /> */}
                  <Link href={{ pathname: '/marketplace' }}>
                    <p className='pl-2 rounded-lg pr-2'>Marketplace</p>
                  </Link>
                </div>
              </>
            )}
            {session?.role == 'admin' && (
              <div className={`${(urlPath == '/system-preferences') ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
                {/* <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} /> */}
                {/* <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" /> */}
                <Link href={{ pathname: '/system-preferences' }}>
                  <p className='pl-2 rounded-lg pr-2'>Preferences</p>
                </Link>
              </div>
            )}
            {/* <div className={`${urlPath == "/suggestions" ? 'bg-[#ffffff20]' : ''} rounded-full px-2 py-1 relative flex items-center w-fit`}>
                            <img height="20px" className="h-[20px] z-20" src={"Dash_W_SQ.png"} />
                            <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" />
                            <Link href={{ pathname: `/suggestions` }} >
                                <p className={'pl-2 rounded-lg pr-2'}  >{"Suggestions"}</p>
                            </Link>
                        </div> */}

          </div>
        </div>

        {/* <div className="relative ">
                    <div>
                        <button
                            className="flex w-full items-center justify-center bg-grey-700 rounded-lg text-white px-2 py-1 hover:text-black"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            {selectedVenue != null && !newVenue && (
                                <>
                                    {selectedVenue}
                                </>
                            )}
                            {newVenue && (
                                <>
                                    {newVenue}
                                </>
                            )}
                            {!selectedVenue && !newVenue && (
                                <>
                                    Venue
                                </>
                            )}
                        </button>
                        {openDropdown && (
                            <div className="absolute cursor-pointer z-50 w-full  text-black shadow-lg">

                                {venueArray && venueArray.map((venue, index) => (
                                    <div key={venue} onClick={() => { changeVenue(venue); setOpenDropdown(false) }} className=" text-center py-1 hover:bg-secondarygrey bg-white first:rounded-t-xl last:rounded-b-xl">
                                        {venue}

                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </div> */}
      </div>
    </div>
  )
}

export default Sidebar
