import React from 'react'
import FormSubmit from './formSubmit'

const parseDateString = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  if (isNaN(date)) {
    return undefined
  } else {
    return `${day}-${month}-${year}`
  }
}

const Comments = ({
  styling,
  comments,
  session,
  section,
  commentLength = 512

}) => {
  const [componentComments, setComments] = React.useState(comments)
  const [commentNumber, setCommentNumber] = React.useState(0)

  const [openForm, setOpenForm] = React.useState(false)

  const [error_Message, setError_Message] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [warning_Message, setWarning_Message] = React.useState('')
  const [warningSubmit, setWarningSubmit] = React.useState(false)

  const handleFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSubmitting(true)

    const comment = e.target.comment.value
    let errorMessage = ''
    const warningMessage = ''

    if (comment == null || comment == '') {
      errorMessage += 'Please enter a comment. '
    }
    if (comment.length > commentLength) {
      errorMessage += `Please use less than ${commentLength} characters. `
    }

    if (warningMessage !== '') {
      setWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (warning_Message != '') {
        setWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setError_Message(errorMessage)
      setWarningSubmit(false)
      setSubmitting(false)
    } else {
      if (error_Message != '') {
        setError_Message('')
      }

      if (warningSubmit == false && warningMessage != '') {
        setWarningSubmit(true)
        setSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          comment,
          section,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-comment'

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
        const result = await response.json().then(() => { setSubmitted(true); setSubmitting(false) })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  return (
        <>
            {componentComments.length > 0 && (

                <div className={`grid grid-cols-[110px_auto_110px] w-full ${styling}`}>
                    {commentNumber == 0 && (
                        <div className='invisible'>hidden</div>
                    )}
                    {commentNumber > 0 && (
                        <div className='flex items-start'>
                            <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setCommentNumber(commentNumber - 1)}>Previous</button>
                        </div>
                    )}
                    <div className='flex flex-col items-center'>
                        <div className='text-center font-semibold'>
                            {componentComments[commentNumber]?.added_by}
                        </div>
                        <div className='text-center text-sm'>
                            {parseDateString(componentComments[commentNumber]?.date_of_comment)}
                        </div>
                    </div>
                    {commentNumber == componentComments.length - 1 && (
                        <div className='invisible'>hidden</div>
                    )}
                    {commentNumber < (componentComments.length - 1) && (
                        <div className='flex items-start'>
                            <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setCommentNumber(commentNumber + 1)}>Next</button>
                        </div>
                    )}
                    <div className='col-span-3 mt-4 text-center'>
                        {componentComments[commentNumber]?.comment}
                    </div>
                </div>
            )}
            {session?.role == 'admin' && componentComments.length > 0 && (
                <div className={'flex justify-center'}>
                    <div className="bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenForm(true)}>
                        Add Comment
                    </div>
                </div>
            )}
            {session?.role == 'admin' && componentComments.length <= 0 && (
                <div className={`flex justify-center ${styling}`}>
                    <div className="bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenForm(true)}>
                        Add Comment
                    </div>
                </div>
            )}
            {openForm && (
                <div className='absolute modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                            <div className="my-4 font-semibold text-lg">
                                Add Comment
                            </div>
                            <div className="w-full">
                                <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleFormSubmit}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="comment"
                                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                                        >
                                            Comment
                                        </label>
                                        <textarea id="comment" placeholder="Enter comment" name="comment" rows={4} cols={87} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"></textarea>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                                        <FormSubmit errorMessage={error_Message} warningMessage={warning_Message} submitted={submitted} submitting={submitting} warningSubmit={warningSubmit} />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div onClick={() => setOpenForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                </div>
            )}
        </>
  )
}

export default Comments
