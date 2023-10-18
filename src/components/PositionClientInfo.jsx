import React from 'react'
import SingleSelectDropdown from './singleSelectDropdown'

const PositionClientInfo = ({ companyData, premiumCompaniesData, session, router }) => {
  const handleCompanyChange = async (e) => {
    const data = {
      new_company: e.name,
      new_company_id: e.record_id,
      email: session?.user.email,
      user: session?.user?.name
    }

    console.log(data)

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/change-selected-company'

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
    const result = await response.json().then(() => {
      router.reload()
      // setSentimentData([...sentimentData, { record_id: "dummyid", bullish_or_bearish, high, low, intraday_average_points, open_interest }])
    })
  }
  return (
    <div className='rounded-lg px-4 py-2 bg-deep_blue text-white flex justify-between -mt-6'>
      <div className='flex flex-col'>
        <div>Client Name: {JSON.parse(companyData)?.name}</div>
        <div>Client Manager Name: {JSON.parse(companyData)?.company_manager?.name}</div>
        <div>Macrovesta Manager Name: {JSON.parse(companyData)?.macrovesta_manager?.name}</div>
      </div>
      <div className='w-[200px] self-center'>
        <SingleSelectDropdown
          options={JSON.parse(premiumCompaniesData)}
          label='Company'
          variable='name'
          colour='bg-white'
          textColour='text-black'
          onSelectionChange={handleCompanyChange}
          placeholder='Select Company'
          searchPlaceholder='Search Company'
          includeLabel={false}
          defaultValue={JSON.parse(companyData)?.name}
        />
      </div>
    </div>
  )
}

export default PositionClientInfo
