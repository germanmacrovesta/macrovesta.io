import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import Alert from './Alert'
import useValidate from '~/hooks/useValidation'
import { useCustomModal } from '~/context/ModalContext'
import ModalForm from './ModalForm'
import ModalInfo from './ModalInfo'
import { parseDateStringFullYear } from '~/utils/dateUtils'

const CustomModal = ({ onOpenChange, isOpen, session, size = 'md', scrollBehavior = 'inside' }) => {
  const { modalType, modalSection, modalData, obtainCustomKeys, obtainEndPoint, obtainMethod } = useCustomModal()

  // Initial object structure for form depends on section.
  const initialObject = obtainCustomKeys(modalSection) // Depends on modalSection initialObjectForm varies
  console.log(initialObject)

  // UseValdation for currentObjectValidation
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

  // If we are editing a register, must load object data, readapt object structure for validation.
  useEffect(() => {
    if (modalSection === 'Edit Product') {
      async function getProduct (modalData) {
        try {
          const response = await fetch(`/api/product?id=${modalData}`)
          const product = await response.json()
          product.agents = product.agents.map(item => item.agent.id)
          product.buyers = product.buyers.map(item => item.buyer.id)
          product.expiry_date = parseDateStringFullYear(product.expiry_date)
          setObjectToValidate(product)
        } catch (error) {
          console.log(error)
        }
      }

      if (modalSection === 'Edit Product') {
        getProduct(modalData)
      }
      setObjectToValidate()
    }
  }, [])

  // Clear any alert when modal open or close
  useEffect(() => {
    setValidationAlert({})
  }, [onOpenChange])

  // Fill the object name/value
  const handleChange = (e) => {
    if (e.name) { // Is File field (File especific)
      setObjectToValidate((objectToValidate) => ({ ...objectToValidate, hvi_file: e.name }))
    } else if (e.target.name === 'agents' || e.target.name === 'buyers') { // Is multiple field select (Array)
      const { name, value } = e.target
      if (value.includes(',')) {
        const valueArray = value.split(',')
        setObjectToValidate({ ...objectToValidate, [name]: valueArray })
      } else {
        setObjectToValidate({ ...objectToValidate, [name]: [value] })
      }
    } else { // Is Basic field (String, Number, Bolean)
      const { name, value } = e.target
      setObjectToValidate((objectToValidate) => ({ ...objectToValidate, [name]: value }))
      console.log(objectToValidate)
    }
  }

  async function sendForm () {
    setObjectIsValid(false)
    const endpoint = obtainEndPoint(modalSection)
    const method = obtainMethod(modalSection)
    console.log(objectToValidate)

    // Add user
    const data = { ...objectToValidate, added_by: session?.user?.name }
    console.log(data)

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    console.log(data, endpoint)

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method,
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
    console.log(result)
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
      size={size} scrollBehavior={scrollBehavior} isOpen={isOpen} onOpenChange={onOpenChange} motionProps={{
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
            y: 80,
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
                <ModalInfo modalSection={modalSection} handleChange={handleChange} handleSubmit={handleSubmit} modalData={modalData} />
              )}

              {modalType === 'form' && (
                <div className='w-full'>
                  {(validationAlert.msg) && <Alert alert={validationAlert} />}
                  <ModalForm modalSection={modalSection} handleChange={handleChange} handleSubmit={handleSubmit} objectToValidate={modalSection === 'Edit Product' && objectToValidate} />
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
