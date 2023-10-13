import { useState } from 'react'
import InfoButton from './infoButton'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'
import { parseDateString } from '~/utils/dateUtils'
import { Select, SelectItem } from '@nextui-org/react'

const RecentEvents = ({ snapshotsData, session, setOpenSnapshotForm, openSnapshotForm }) => {
  // RecentEvents, Future and modal30SecsSnapshot
  const [snapshotPopup, setSnapshotPopup] = useState(null)
  const [snapshotErrorMessage, setSnapshotErrorMessage] = useState('')
  const [snapshotSubmitted, setSnapshotSubmitted] = useState(false)
  const [snapshotSubmitting, setSnapshotSubmitting] = useState(false)
  const [snapshotWarningMessage, setSnapshotWarningMessage] = useState('')
  const [snapshotWarningSubmit, setSnapshotWarningSubmit] = useState(false)
  const [selectedNewsType, setSelectedNewsType] = useState('')
  const [contractParameter, setContractParameter] = useState('recent')

  const dropdownOptions = [{ name: 'Recent Events', parameter: 'recent' }, { name: 'Most Relevant', parameter: 'relevant' }]

  const handleSnapshotFormSubmit = async (e) => {
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

    if (selectedNewsType !== null && selectedNewsType !== '' && selectedNewsType !== 'Select Snapshot Type') {
      news_type = selectedNewsType
    } else {
      errorMessage += 'Please select a snapshot type. '
    }
    if (title == null || title === '') {
      errorMessage += 'Please enter a title. '
    }
    if (text == null || text === '') {
      errorMessage += 'Please enter a text. '
    }
    if (image == null || image === '') {
      warningMessage += "You can add an image as well. If you don't want to just click confirm. "
    }

    if (warningMessage !== '') {
      setSnapshotWarningMessage(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (snapshotWarningMessage !== '') {
        setSnapshotWarningMessage('')
      }
    }

    if (errorMessage !== '') {
      setSnapshotErrorMessage(errorMessage)
      setSnapshotWarningSubmit(false)
      setSnapshotSubmitting(false)
    } else {
      if (snapshotErrorMessage !== '') {
        setSnapshotErrorMessage('')
      }

      if (snapshotWarningSubmit === false && warningMessage !== '') {
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

  return (
    <div className='flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>
      <div className='flex relative items-center justify-between px-1'>
        <h2 className='font-semibold text-2xl relative'>
          Recent Events
          {/* <InfoButton text='Find a summarised list of events which have happened over the past weeks.  ' /> */}
        </h2>
        <Select
          radius='md'
          label='Show'
          className='max-w-xs'
          onChange={(e) => setContractParameter(e.target.value)}
          size='sm'
          variant='underlined'
        >
          {dropdownOptions.map((option) => (
            <SelectItem key={option.parameter} value={option.parameter}>
              {option.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className='grid grid-cols-2 grid-rows-1 gap-4 mt-4'>
        {JSON.parse(snapshotsData).filter((object, index) => object.news_type === 'Recent Events').filter((object, index) => index < 3).map((snapshot, index) => (
          <div key={index} className={`${index === 0 ? ' row-span-2' : ''}`}>
            <div className='h-full border relative hover:scale-105 transition-transform transition-colors duration-300 shadow-lg rounded-lg w-full cursor-pointer flex gap-4 overflow-hidden' onClick={() => setSnapshotPopup(snapshot)}>
              <img
                className={`${index === 0 ? 'object-cover absolute' : 'w-[150px] h-[150px] aspect-square object-cover rounded-lg'}`}
                src={snapshot?.image_of_snapshot_strategy !== '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'}
              />
              <div className={`${index === 0 ? 'bg-gradient-to-t  from-black w-full h-full absolute z-10' : ''}`} />
              <div className={`${index === 0 ? 'absolute bottom-0 text-white z-20 p-4' : 'flex flex-col w-full'}`}>
                <div className='grid grid-cols-[auto_75px]'>
                  <div className='font-semibold'>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                  <div className='w-[75px]'>
                    {parseDateString(snapshot.date_of_snapshot_strategy)}
                  </div>
                </div>
                <div className='text-sm pt-2'>{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
              </div>
            </div>
          </div>
        ))}

        {/* {snapshotPopup !== null && (
          <div className='absolute modal left-0 top-0 z-40'>
            <div className=' fixed grid place-content-center inset-0 z-40'>
              <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                <img className='w-3/4' src={snapshotPopup.image_of_snapshot_strategy} />
                <div className='my-4 font-semibold text-lg'>
                  {snapshotPopup.title_of_snapshot_strategy}
                </div>
                <div className='-mt-4 mb-2'>
                  {parseDateString(snapshotPopup.date_of_snapshot_strategy)}
                </div>
                <div className=''>
                  {snapshotPopup.text_of_snapshot_strategy}
                </div>
              </div>
              <div onClick={() => setSnapshotPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
            </div>
          </div>
        )} */}
      </div>
      {(session?.role === 'partner' || session?.role === 'admin') && (
        <div className='flex justify-center'>
          <div className='bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={() => setOpenSnapshotForm(true)}>
            Add 30 Seconds Snapshot
          </div>
        </div>
      )}

      <div className='flex flex-col w-full justify-start items-start gap-x-8 gap-y-4 mt-4'>
        <div className='relative w-full text-center font-semibold text-xl mt-10'>
          <InfoButton text='Find a list of future considerations for the cotton industry, divided into short and long term. ' />
          Future Considerations
        </div>
        <div className='grid grid-cols-2 grid-rows-1 gap-4 mt-4'>
          {JSON.parse(snapshotsData).filter((object, index) => (object.news_type === 'Short Term' || object.news_type === 'Long Term')).filter((object, index) => index < 3).sort((a, b) => { if (a.news_type < b.news_type) return 1; if (a.news_type > b.news_type) return -1; return 0 }).map((snapshot, index) => (
            <div key={index} className={` ${index === 0 ? ' row-span-2' : ''}`}>
              <div className='h-full border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4' onClick={() => setSnapshotPopup(snapshot)}>
                <img className='w-[150px] h-[150px] aspect-square object-cover rounded-lg' src={snapshot?.image_of_snapshot_strategy !== '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'} />
                <div className='flex flex-col w-full'>
                  <div className='grid grid-cols-[auto_75px]'>
                    <div className='font-semibold'>
                      {snapshot.title_of_snapshot_strategy}
                    </div>
                    <div className='w-[75px]'>
                      {parseDateString(snapshot.date_of_snapshot_strategy)}
                    </div>
                  </div>
                  <div className='text-sm pt-2'>{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* {JSON.parse(snapshotsData).map((snapshot) => (
                  <div>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                ))} */}
        {/* {JSON.parse(snapshotsData).filter((object, index) => (object.news_type === 'Short Term' || object.news_type === 'Long Term')).filter((object, index) => index < 8).sort((a, b) => { if (a.news_type < b.news_type) return 1; if (a.news_type > b.news_type) return -1; return 0 }).map((snapshot, index) => (
            // <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full h-fit py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
            //   <div>
            //     {snapshot.title_of_snapshot_strategy}
            //   </div>
            //   <div className="min-w-[80px]">
            //     {snapshot.news_type}
            //   </div>
            // </div>
            <>
              {index === 0 && (
                <div key={index} className='border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4' onClick={() => setSnapshotPopup(snapshot)}>
                  <img className='w-[150px] h-[150px] aspect-square object-cover rounded-lg' src={snapshot?.image_of_snapshot_strategy !== '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'} />
                  <div className='flex flex-col w-full'>
                    <div className='grid grid-cols-[auto_75px]'>
                      <div className='font-semibold'>
                        {snapshot.title_of_snapshot_strategy}
                      </div>
                      <div className='w-[75px]'>
                        {parseDateString(snapshot.date_of_snapshot_strategy)}
                      </div>
                    </div>
                    <div className='text-sm pt-2'>{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
                  </div>
                </div>
              )}
              {index !== 0 && (
                <div className='border grid grid-cols-[auto_100px] hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer' onClick={() => setSnapshotPopup(snapshot)}>
                  <div>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                  <div>
                    {snapshot.news_type}
                  </div>
                </div>
              )}
            </>
          ))} */}

        {/*  */}
        {snapshotPopup != null && (
          <div className='absolute modal left-0 top-0 z-40'>
            <div className=' fixed grid place-content-center inset-0 z-40'>
              <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                <img className='w-3/4' src={snapshotPopup.image_of_snapshot_strategy} />
                <div className='my-4 font-semibold text-lg'>
                  {snapshotPopup.title_of_snapshot_strategy}
                </div>
                <div className='-mt-4 mb-2'>
                  {parseDateString(snapshotPopup.date_of_snapshot_strategy)}
                </div>
                <div className=''>
                  {snapshotPopup.text_of_snapshot_strategy}
                </div>
              </div>
              <div onClick={() => setSnapshotPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
            </div>
          </div>
        )}
      </div>

      {/* 30 Seconds Snapshot button (Modal) */}
      {(session?.role === 'partner' || session?.role === 'admin') && (
        <div className='flex justify-center'>
          <div className='bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={() => setOpenSnapshotForm(true)}>
            Add 30 Seconds Snapshot
          </div>
        </div>
      )}
      {openSnapshotForm && (
        <div className='absolute modal left-0 top-0 z-40'>
          <div className=' fixed grid place-content-center inset-0 z-40'>
            <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
              <div className='my-4 font-semibold text-lg'>
                Add 30 Seconds Snapshot
              </div>
              <div className='w-full'>
                <form className='mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full' onSubmit={handleSnapshotFormSubmit}>
                  <div className='mb-4'>
                    <div className='mb-4'>
                      <SingleSelectDropdown
                        options={[{ name: 'Recent Events', value: 'Recent Events' }, { name: 'Short Term Consideration', value: 'Short Term' }, { name: 'Long Term Consideration', value: 'Long Term' }]}
                        label='snapshot_type'
                        variable='name'
                        colour='bg-deep_blue'
                        onSelectionChange={(e) => setSelectedNewsType(e.value)}
                        placeholder='Select Snapshot Type'
                        searchPlaceholder='Search Types'
                        includeLabel={false}
                      />
                    </div>
                    <label
                      htmlFor='image'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Image (optional)
                    </label>
                    <input
                      type='text'
                      id='image'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter a url to an image e.g. https://picsum.photos/200'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='title'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Title
                    </label>
                    <input
                      type='text'
                      id='title'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter title'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='text'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Text
                    </label>
                    <textarea id='text' placeholder='Enter text' name='text' rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
                  </div>

                  <div className='col-span-2 flex justify-center'>
                    {/* <button
                                type="submit"
                                className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                              >
                                Submit
                              </button> */}
                    <FormSubmit errorMessage={snapshotErrorMessage} warningMessage={snapshotWarningMessage} submitted={snapshotSubmitted} submitting={snapshotSubmitting} warningSubmit={snapshotWarningSubmit} />
                  </div>
                </form>
              </div>
            </div>
            <div onClick={() => setOpenSnapshotForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentEvents
