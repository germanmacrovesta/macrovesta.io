import { useEffect, useState } from 'react'
import InfoButton from './infoButton'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'
import { parseDateString } from '~/utils/dateUtils'
import { Select, SelectItem, Pagination } from '@nextui-org/react'
import Image from 'next/image'

// Component only must obtain recentevents data, must split outsideComponent
// JSON.parse(snapshotsData).filter(object => object.news_type === 'Recent Events'

const RecentEvents = ({ snapshotsData, session }) => {
  // RecentEvents, Future and modal30SecsSnapshot
  const [snapshotPopup, setSnapshotPopup] = useState(null)
  const [snapshotErrorMessage, setSnapshotErrorMessage] = useState('')
  const [snapshotSubmitted, setSnapshotSubmitted] = useState(false)
  const [snapshotSubmitting, setSnapshotSubmitting] = useState(false)
  const [snapshotWarningMessage, setSnapshotWarningMessage] = useState('')
  const [snapshotWarningSubmit, setSnapshotWarningSubmit] = useState(false)
  const [selectedNewsType, setSelectedNewsType] = useState('')
  const [openSnapshotForm, setOpenSnapshotForm] = useState(false)

  const [filters, setFilters] = useState({
    impact: 'High',
    show: 3
  })

  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * filters.show
  const endIndex = startIndex + filters.show

  const [filteredData, setFilteredData] = useState(JSON.parse(snapshotsData)) // Top filters data
  const [itemsToDisplay, setItemsToDisplay] = useState(filteredData.slice(startIndex, endIndex))

  // When currentPage change:
  useEffect(() => {
    const startIndex = (currentPage - 1) * parseInt(filters.show)
    const endIndex = startIndex + parseInt(filters.show)
    setItemsToDisplay(filteredData.slice(startIndex, endIndex))
  }, [currentPage])

  // When filters are applied
  useEffect(() => {
    const applyFilters = () => {
      // Filter data by diferent parameters on top of component
      // TODO: Data 'RecentEvents' must be filtered before getting on component
      let filteredResult = JSON.parse(snapshotsData).filter(object => object.news_type === 'Recent Events')
      const { impact } = filters

      if (impact !== '') {
        filteredResult = filteredResult.filter(object => object.impact === impact)
      }

      setFilteredData(filteredResult)

      // Recalculate pagination
      const startIndex = (currentPage - 1) * parseInt(filters.show)
      const endIndex = startIndex + parseInt(filters.show)

      setCurrentPage(1)
      setItemsToDisplay(filteredResult.slice(startIndex, endIndex))
    }

    applyFilters()
  }, [filters])

  const impactOptions = [{ name: 'High Impact', parameter: 'High' }, { name: 'Low impact', parameter: 'Low' }]
  const showOptions = [{ name: '3', parameter: '3' }, { name: '6', parameter: '6' }, { name: '10', parameter: '10' }]

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
      <div className='flex relative items-center justify-between'>
        <h2 className='font-semibold text-2xl relative'>
          Recent Events
          {/* <InfoButton text='Find a summarised list of events which have happened over the past weeks.  ' /> */}
        </h2>

        <div className='flex justify-end gap-4 w-[50%]'>
          <Select
            radius='md'
            label='Impact'
            className='max-w-sm'
            onChange={(e) => setFilters({ ...filters, impact: e.target.value })}
            size='sm'
            placeholder='Default: All'
            variant='underlined'
            defaultSelectedKeys={['High']}
          >
            {impactOptions.map((option) => (
              <SelectItem key={option.parameter} value={option.parameter}>
                {option.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            radius='md'
            label='Show per page'
            className='max-w-xs'
            onChange={(e) => setFilters({ ...filters, show: e.target.value || 3 })}
            placeholder='Default: 3'
            size='sm'
            variant='underlined'
            defaultSelectedKeys={['3']}
          >
            {showOptions.map((option) => (
              <SelectItem key={option.parameter} value={option.parameter}>
                {option.name}
              </SelectItem>
            ))}
          </Select>
        </div>

      </div>

      <div className='grid grid-cols-2 grid-rows-1 gap-4 mt-4'>
        {!filteredData || filteredData === []
          ? ('OPS')
          : itemsToDisplay.map((snapshot, index) => (
            <div key={index} className={`${index === 0 && itemsToDisplay.length === 3 ? ' row-span-2' : ''}`}>
              <div className='h-full border relative hover:scale-[102%] transition-transform duration-300 shadow-lg rounded-lg w-full cursor-pointer flex gap-2 overflow-hidden' onClick={() => setSnapshotPopup(snapshot)}>
                <Image
                  src={snapshot?.image_of_snapshot_strategy !== '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'}
                  className={`${index === 0 && itemsToDisplay.length === 3 ? 'object-cover absolute' : 'w-[150px] h-[150px] aspect-square object-cover rounded-lg'}`}
                  alt='Picture of the author'
                  height={720}
                  width={1280}
                />
                <div className={`${index === 0 && itemsToDisplay.length === 3 ? 'bg-gradient-to-t  from-black w-full h-full absolute z-10' : ''}`} />
                <div className={`${index === 0 && itemsToDisplay.length === 3 ? 'absolute bottom-0 text-white z-20 p-4' : 'flex flex-col justify-center px-2'}`}>
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

      <div className='flex items-center justify-between mt-4'>
        {(session?.role === 'partner' || session?.role === 'admin') && (
          <div className='flex justify-center'>
            <div className='bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={() => setOpenSnapshotForm(true)}>
              Add 30 Seconds Snapshot
            </div>
          </div>
        )}
        <Pagination
          total={Math.ceil(filteredData.length / parseInt(filters.show))}
          page={currentPage}
          onChange={setCurrentPage}
          classNames={{ cursor: 'bg-deep_blue' }}
        />
      </div>
      {snapshotPopup !== null && (
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
