import React, { useState } from 'react'

const DemoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    preferredDate: '',
    preferredTime: '', // New field for preferred time
    companyType: 'festival'
  })

  const [error_Message, setError_Message] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [warning_Message, setWarning_Message] = React.useState('')
  const [warningSubmit, setWarningSubmit] = React.useState(false)

  const [formStage, setFormStage] = React.useState(1)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  //   const handleSubmit = (event) => {
  //     event.preventDefault();
  //     onSubmit(formData);
  //   };

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
    setSubmitting(true)

    const firstName = formData.firstName
    const lastName = formData.lastName
    const email = formData.email
    const companyName = formData.companyName
    const preferredDate = formData.preferredDate
    const preferredTime = formData.preferredTime
    const companyType = formData.companyType

    console.log(preferredDate, preferredTime)

    let errorMessage = ''
    const warningMessage = ''

    if (firstName == '') {
      errorMessage += 'Please enter your name. '
    }

    if (lastName == '') {
      errorMessage += 'Please enter your lastname. '
    }

    if (email == '') {
      errorMessage += 'Please enter your email. '
    }

    if (companyName == '') {
      errorMessage += 'Please enter your company name. '
    }

    if (preferredDate == '') {
      errorMessage += 'Please enter your preferred date. '
    }

    if (preferredTime == '') {
      errorMessage += 'Please enter your preferred time. '
    }

    if (companyType == '') {
      errorMessage += 'Please enter your company type. '
    }

    if (errorMessage !== '') {
      // setError_Message(errorMessage);
      setSubmitting(false)
      // throw new Error(errorMessage)
    } else {
      if (error_Message != '') { setError_Message('') }

      // Get data from the form.
      const data = {
        firstName,
        lastName,
        companyName,
        preferredDate,
        companyType,
        email,
        preferredTime
      }

      console.log(data)

      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(data)

      // API endpoint where we send form data.
      const endpoint = '/api/add-demo-request'

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
    }
  }

  const isCurrentStageFormFilled = () => {
    switch (formStage) {
      case 1:
        return formData.firstName !== '' && formData.lastName !== '' && formData.email !== ''
      case 2:
        return (
          formData.companyType !== 'festival' && formData.companyType !== 'select industry type' && formData.companyName !== ''
        )
      case 3:
        return (
          formData.preferredDate !== null && formData.preferredTime !== null
        )
      default:
        return true // For other stages, no specific validation required.
    }
  }

  return (
        <form className='text-xs sm:text-base' onSubmit={handleSubmit}>
            {!submitted && (
                <>
                    {formStage == 1 && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="firstName" className="block font-bold text-gray-700 mb-2">
                                    Your Name
                                </label>
                                <div className='flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 gap-x-0 sm:gap-x-4 justify-between'>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className=" px-4 py-2 border rounded flex-grow"
                                        required
                                    />
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className=" px-4 py-2 border rounded flex-grow"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block font-bold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="px-4 py-2 border rounded w-full"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {formStage == 2 && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="companyName" className="block font-bold text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    className="px-4 py-2 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="companyType" className="block font-bold text-gray-700 mb-2">
                                    Company Type
                                </label>
                                <select
                                    id="companyType"
                                    name="companyType"
                                    value={formData.companyType}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded w-full"
                                    required
                                >
                                    <option value="select company type">
                                        Select Company Type
                                    </option>
                                    <option value="farmers">Farmers</option>
                                    <option value="processors">Processors</option>
                                    <option value="merchants">Merchants</option>
                                    <option value="retailers">Retailers</option>
                                    {/* <option value="festival">Festival</option>
                  <option value="venue">Venue</option>
                  <option value="organiser">Organiser</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="waste manager">Waste Manager</option> */}
                                </select>
                            </div>
                        </>
                    )}
                    {formStage == 3 && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="preferredDate" className="block font-bold text-gray-700 mb-2">
                                    Select Preferred Date
                                </label>
                                <input
                                    type="date"
                                    id="preferredDate"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded w-full"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="preferredTime" className="block font-bold text-gray-700 mb-2">
                                    Preferred Time for Demo gmt/Bst
                                </label>
                                <input
                                    type="time"
                                    id="preferredTime"
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded w-full"
                                    required
                                />
                            </div>
                        </>
                    )}

                </>
            )}
            {formStage > 1 && !submitted && (
                <button
                    className="mx-4 rounded bg-deep_blue px-4 py-2 text-white shadow-lg duration-200 hover:scale-105"
                    onClick={() => { setError_Message(''); setFormStage(formStage - 1) }}
                >
                    Prev
                </button>
            )}

            {formStage !== 3 && (
                <button
                    type='button'
                    className="mx-4 rounded bg-deep_blue px-4 py-2 text-white shadow-lg duration-200 hover:scale-105"
                    onClick={() => {
                      if (isCurrentStageFormFilled()) {
                        setError_Message('')
                        setFormStage(formStage + 1)
                      } else {
                        setError_Message(
                          'Please fill out all the fields before you continue'
                        )
                      }
                    }}
                >
                    Next
                </button>
            )}

            {formStage == 3 && !submitting && !submitted && (
                <>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>

                </>
            )}
            {formStage == 3 && submitting && (
                <div className="text-center">  Your form is submitting...</div>
            )}

            {formStage == 3 && submitted && (
                <div className="text-center"> Thanks! We will get back to you soon.</div>
            )}

            {error_Message != '' && (
                <>{error_Message}</>
            )}
        </form>
  )
}

export default DemoForm
