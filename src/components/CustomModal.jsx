import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from '@nextui-org/react'
import { parseDateString } from '~/utils/dateUtils'
import Alert from './Alert'
import useValidate from '~/hooks/useValidation'
import { useCustomModal } from '~/context/ModalContext'
// TODO: Modal for FutureEvents, RecentEvents & InCountryNews. Have to split Validations and Submit into CHook or Functions
const CustomModal = ({ isOpen, onOpenChange, size = 'md', session }) => {
  const { modalType, modalSection, modalData } = useCustomModal()
  // Build the required fields that user must be introduce depending on section type
  const initialObject = {
    title: '',
    text: '',
    impact: '',
    ...(modalSection === 'In Country News' && { country: '' }),
    ...(modalSection === 'Recent Events' && { news_type: modalSection }),
    ...(modalSection === 'Future Considerations' && { news_type: '' })
  }

  console.log(initialObject)

  const {
    validationAlert,
    setValidationAlert,
    setStartValidation,
    objectToValidate,
    setObjectToValidate,
    objectIsValid,
    setObjectIsValid
  } = useValidate(initialObject)
  console.log(objectToValidate)
  // Clear any alert when modal open or close
  useEffect(() => {
    setValidationAlert({})
  }, [onOpenChange])

  // Select Options (Can be moved into a sample CONST file)
  const impactSelect = [{ name: 'High Impact', parameter: 'High' }, { name: 'Low impact', parameter: 'Low' }]
  const countrySelect = [{ country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]
  const termSelect = [{ parameter: 'Long Term' }, { parameter: 'Short Term' }]

  // Data to Display when modal is 'info' type
  const title = modalData?.title_of_snapshot_strategy || modalData?.title_of_in_country_news
  const text = modalData?.text_of_snapshot_strategy || modalData?.text_of_in_country_news
  const date = modalData?.date_of_snapshot_strategy || modalData?.date_of_in_country_news
  const image = modalData?.image_of_snapshot_strategy || modalData?.image_of_in_country_news
  const countryData = modalData?.country

  // Fill the object name/value
  const handleChange = (e) => {
    const { name, value } = e.target
    setObjectToValidate((objectToValidate) => ({ ...objectToValidate, [name]: value }))
    console.log(objectToValidate)
  }

  async function sendForm () {
    console.log(objectToValidate)
    setObjectIsValid(false)
    const data = { ...objectToValidate, user: session?.user?.name }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = modalSection === 'In Country News' ? '/api/add-country-news' : '/api/add-snapshot'

    console.log(objectToValidate, endpoint)

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
  }

  useEffect(() => {
    if (objectIsValid) {
      sendForm()
      setValidationAlert({ msg: 'Success', error: false })
    }
  }, [objectIsValid])

  const handleSnapshotFormSubmit = async (e) => {
    e.preventDefault()
    setStartValidation(true)
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
              {modalType === 'info' && (
                <h2 className='text-center'>{modalSection}</h2>
              )}
              {modalType === 'form' && (
                <h2 className='text-center'>{modalSection}</h2>
              )}
            </ModalHeader>
            <ModalBody>
              {modalType === 'info' && (
                <div className='flex flex-col items-center justify-center'>
                  {modalSection === 'In Country News' && (
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

              {modalType === 'form' && (

                <div className='w-full'>
                  {(validationAlert.msg) && <Alert alert={validationAlert} />}
                  <form className='mt-4 flex flex-col gap-x-4 w-full' id='modal-form' onSubmit={handleSnapshotFormSubmit}>
                    <div className='flex gap-4'>
                      <Select
                        radius='md'
                        label='Select the impact'
                        classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                        className='mb-4'
                        size='md'
                        name='impact'
                        onChange={handleChange}
                        placeholder='Select the impact'
                        variant='bordered'
                        labelPlacement='outside'
                      >
                        {impactSelect.map((option) => (
                          <SelectItem key={option.parameter} value={option.parameter}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </Select>
                      {modalSection === 'Future Considerations' && (
                        <Select
                          radius='md'
                          label='Select the term'
                          classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                          className='mb-4'
                          size='md'
                          name='news_type'
                          onChange={handleChange}
                          placeholder='Future long/short term consideration'
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
                    {modalSection === 'In Country News' && (
                      <Select
                        radius='md'
                        label='Select a Country'
                        classNames={{ label: 'font-bold', trigger: 'rounded-md border border-gray-300' }}
                        className='mb-4'
                        size='md'
                        name='country'
                        onChange={handleChange}
                        placeholder='Select the country'
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
                        name='image'
                        onChange={handleChange}
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
                        name='title'
                        onChange={handleChange}
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
                      <textarea placeholder='Enter text' name='text' onChange={handleChange} rows={4} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
                    </div>

                  </form>
                </div>
              )}

            </ModalBody>
            {modalType === 'form' && (
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
