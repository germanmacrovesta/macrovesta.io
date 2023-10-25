import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from '@nextui-org/react'
import { parseDateString } from '~/utils/dateUtils'
import Alert from './Alert'
import useValidate from '~/hooks/useValidation'
import { useCustomModal } from '~/context/ModalContext'
import ModalForm from './ModalForm'

// TODO: Modal for FutureEvents, RecentEvents & InCountryNews. Have to split Validations and Submit into CHook or Functions
const CustomModal = ({ isOpen, onOpenChange, size = 'md', session }) => {
  const { modalType, modalSection, modalData } = useCustomModal()

  // Can be extracted from here
  function obtainCustomKeys (modalSection) {
    let objectShape
    console.log(modalSection)
    switch (modalSection) {
      case 'In Country News':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          country: ''
        }
        return objectShape
      case 'Recent Events':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          news_type: modalSection
        }
        return objectShape
      case 'Future Considerations':
        objectShape = {
          title: '',
          text: '',
          impact: '',
          news_type: ''
        }
        return objectShape
      case 'Add Product':
        objectShape = {
          product: '',
          category: '',
          quantity: '',
          description: '',
          price_usd: '',
          quality: '',
          shipment: '',
          payment_terms: ''
        }
        return objectShape
      default:
        console.log(modalSection)
        break
    }
  }

  function obtainEndPoint (modalSection) {
    let endpoint
    switch (modalSection) {
      case 'In Country News':
        endpoint = '/api/add-country-news'
        return endpoint
      case 'Recent Events':
      case 'Future Considerations':
        endpoint = '/api/add-snapshot'
        return endpoint
      case 'Add Product':
        endpoint = '/api/add-product'
        return endpoint
      default:
        console.log(modalSection)
        break
    }
  }

  // ---

  const initialObject = obtainCustomKeys(modalSection) // Depends on modalSection initialObjectForm varies
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
  }

  async function sendForm () {
    setObjectIsValid(false)
    const data = { ...objectToValidate, user: session?.user?.name }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = obtainEndPoint(modalSection)

    console.log(objectToValidate, endpoint)
    return
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(objectToValidate)
    setStartValidation(true)
  }

  return (
    <Modal
      size='2xl' isOpen={isOpen} onOpenChange={onOpenChange} motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            }
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn'
            }
          }
        }
      }} classNames={{
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
              <h2 className='text-center'>{modalSection}</h2>
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
                  <ModalForm modalSection={modalSection} handleChange={handleChange} handleSubmit={handleSubmit} />
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
