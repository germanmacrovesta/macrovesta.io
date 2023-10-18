import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { parseDateString } from '~/utils/dateUtils'

const CustomModal = ({ isOpen, onOpenChange, type, newsType, size = 'md', snapshotData }) => {
  const [snapshotErrorMessage, setSnapshotErrorMessage] = useState('')
  const [snapshotWarningMessage, setSnapshotWarningMessage] = useState('')
  const [snapshotWarningSubmit, setSnapshotWarningSubmit] = useState(false)

  const typeOfSubmitOptions = [{ name: 'Recent Events', value: 'Recent Events' }, { name: 'Short Term Consideration', value: 'Short Term' }, { name: 'Long Term Consideration', value: 'Long Term' }]

  const handleSnapshotFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    console.log('submiting')
    setSnapshotSubmitting(true)

    let news_type = ''
    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value
    let errorMessage = ''
    let warningMessage = ''

    // TODO: Can be separated into Custom Hook validation
    if (newsType !== null && newsType !== '') {
      news_type = newsType
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
        // TODO: SEND DATA
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
            <ModalHeader className='flex flex-col gap-1'>Add Snapshot to {newsType}</ModalHeader>
            <ModalBody>
              {type === 'info' && (
                <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                  <img className='w-3/4' src={snapshotData.image_of_snapshot_strategy} />
                  <div className='my-4 font-semibold text-lg'>
                    {snapshotData.title_of_snapshot_strategy}
                  </div>
                  <div className='-mt-4 mb-2'>
                    {parseDateString(snapshotData.date_of_snapshot_strategy)}
                  </div>
                  <div className=''>
                    {snapshotData.text_of_snapshot_strategy}
                  </div>
                </div>
              )}

              {type === 'form' && (
                <div className='w-full'>
                  <form className='mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full' id='2' onSubmit={handleSnapshotFormSubmit}>
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
                    <div className='mb-4'>
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
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <button type='submit' form='2'>Submit</button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CustomModal
