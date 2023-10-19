import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from '@nextui-org/react'
import { parseDateString } from '~/utils/dateUtils'

// TODO: Modal for FutureEvents, RecentEvents & InCountryNews. Have to split Validations and Submit into CHook or Functions
const CustomModal = ({ isOpen, onOpenChange, type, section, size = 'md', snapshotData, session }) => {
  const [alert, setAlert] = useState('')

  // Clear any alert when modal open or close
  useEffect(() => {
    setAlert('')
  }, [onOpenChange])

  // Select Options
  const impactSelect = [{ name: 'High Impact', parameter: 'High' }, { name: 'Low impact', parameter: 'Low' }]
  const countrySelect = [{ country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]
  const termSelect = [{ parameter: 'Long Term' }, { parameter: 'Short Term' }]

  // Data to Display when modal is Info type
  const title = snapshotData?.title_of_snapshot_strategy || snapshotData?.title_of_in_country_news
  const text = snapshotData?.text_of_snapshot_strategy || snapshotData?.text_of_in_country_news
  const date = snapshotData?.date_of_snapshot_strategy || snapshotData?.date_of_in_country_news
  const image = snapshotData?.image_of_snapshot_strategy || snapshotData?.image_of_in_country_news
  const countryData = snapshotData?.country

  // Data to fill when modal is Form type
  const [country, setCountry] = useState('UK')
  const [impact, setImpact] = useState('Low')
  const [term, setTerm] = useState('Short Term')

  const handleSnapshotFormSubmit = async (e) => {
    e.preventDefault()

    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value

    if (section === null && section === '') {
      setAlert('Error identifying section!')
      return
    }

    if (title === null || title === '') {
      setAlert('Please enter a title. ')
      return
    }

    if (text === null || text === '') {
      setAlert('Please enter a text.')
      return
    }

    if (country === null || text === '') {
      setAlert('Please enter a country.')
      return
    }

    if (section === 'Future Considerations' && term === '') {
      setAlert('Please enter a term.')
      return
    }

    setAlert('')

    const data = {
      title,
      text,
      image,
      impact,
      user: session?.user?.name,
      ...(section === 'In Country News' && { country }),
      ...(section === 'Recent Events' && { news_type: section }),
      ...(section === 'Future Considerations' && { news_type: term })
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = section === 'In Country News' ? '/api/add-country-news' : '/api/add-snapshot'

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
    console.log(response)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()

    setAlert('Successfully added')
  }

  return (
    <Modal
      size='2xl' isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
        body: 'py-6',
        backdrop: 'bg-[#292f46]/50 backdrop-opacity-40',
        header: 'border-b-[1px] border-[#bec1ce]',
        footer: 'border-t-[1px] border-[#bec1ce]',
        closeButton: 'hover:bg-white/5 active:bg-white/10'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {type === 'info' && (
                <h2 className='text-center'>{section}</h2>
              )}
              {type === 'form' && (
                <h2 className='text-center'>{section}</h2>
              )}
            </ModalHeader>
            <ModalBody>
              {type === 'info' && (
                <div className='flex flex-col items-center justify-center'>
                  {section === 'In Country News' && (
                    <h1>{countryData}</h1>
                  )}
                  <img className='w-3/4' src={image} />
                  <div className='my-4 font-semibold text-lg'>
                    {title}
                  </div>
                  <div className='-mt-4 mb-2'>
                    {parseDateString(date)}
                  </div>
                  <div className=''>
                    {text}
                  </div>
                </div>
              )}

              {type === 'form' && (

                <div className='w-full'>
                  {alert !== '' && (
                    <p className={`${alert === 'Successfully added' ? 'bg-green-600' : 'bg-danger-600'} rounded-lg text-center  p-1 text-white animate-fade-up`}>{alert}</p>
                  )}
                  <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSnapshotFormSubmit}>
                    <div className='flex gap-4'>
                      <Select
                        radius='md'
                        label='Select the impact'
                        classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                        className='mb-4'
                        size='md'
                        onChange={(e) => setImpact(e.target.value || 'Low')}
                        placeholder='Default: Low Impact'
                        defaultSelectedKeys={['Low']}
                        variant='bordered'
                        labelPlacement='outside'
                      >
                        {impactSelect.map((option) => (
                          <SelectItem key={option.parameter} value={option.parameter}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </Select>
                      {section === 'Future Considerations' && (
                        <Select
                          radius='md'
                          label='Select the term'
                          classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                          className='mb-4'
                          size='md'
                          onChange={(e) => setTerm(e.target.value || 'Short Term')}
                          placeholder='Default: UK'
                          defaultSelectedKeys={['Short Term']}
                          variant='bordered'
                          labelPlacement='outside'
                        >
                          {termSelect.map((option) => (
                            <SelectItem key={option.parameter} value={option.parameter}>
                              {option.parameter}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </div>
                    {section === 'In Country News' && (
                      <Select
                        radius='md'
                        label='Select a Country'
                        classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                        className='mb-4'
                        size='md'
                        onChange={(e) => setCountry(e.target.value || 'UK')}
                        placeholder='Default: UK'
                        defaultSelectedKeys={['UK']}
                        variant='bordered'
                        labelPlacement='outside'
                      >
                        {countrySelect.map((option) => (
                          <SelectItem key={option.country} value={option.country}>
                            {option.country}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                    <div className='mb-4'>
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
                    <div>
                      <label
                        htmlFor='text'
                        className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                      >
                        Text
                      </label>
                      <textarea id='text' placeholder='Enter text' name='text' rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
                    </div>

                  </form>
                </div>
              )}

            </ModalBody>
            {type === 'form' && (
              <ModalFooter>
                <Button
                  color='danger' variant='light' onPress={onClose}
                >
                  Close
                </Button>
                <Button className='bg-deep_blue text-white' type='submit' form='modal-form'>
                  Submit
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CustomModal
