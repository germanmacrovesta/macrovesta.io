import { useState } from 'react'
import InfoButton from './infoButton'
import GroupedBarChart from './groupedBarChart'
import { basisBarChartData, transformData } from '~/utils/calculateUtils'
import LineGraph from './lineGraph'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'
import Comments from './comments'

const BasisCosts = ({ session, basisData, commentsData }) => {
  const [selectedCostType, setSelectedCostType] = useState('FOB')
  const [selectedCountry, setSelectedCountry] = useState(undefined)
  const [selectedFormCostType, setSelectedFormCostType] = useState(undefined)
  const [basisCountry, setBasisCountry] = useState('Brazil')
  const [openBasisCostForm, setOpenBasisCostForm] = useState(false)

  const [error_Message, setError_Message] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [warning_Message, setWarning_Message] = useState('')
  const [warningSubmit, setWarningSubmit] = useState(false)

  const handleBasisFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSubmitting(true)

    let country = ''
    let cost_type = ''
    const contractOneBasis = e.target.ctz23.value
    const contractTwoBasis = e.target.ctz24.value
    let errorMessage = ''
    const warningMessage = ''

    if (selectedCountry != null && selectedCountry != 'Select Country') {
      country = selectedCountry
    } else {
      errorMessage += 'Please select a Country. '
    }

    if (selectedFormCostType != null && selectedFormCostType != 'Select cost type') {
      cost_type = selectedFormCostType
    } else {
      errorMessage += 'Please select a cost type. '
    }

    if (contractOneBasis == null || contractOneBasis == '') {
      errorMessage += 'Please enter Estimate for CTZ23. '
    }
    if (contractTwoBasis == null || contractTwoBasis == '') {
      errorMessage += 'Please enter Estimate for CTZ24. '
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
          country,
          contractOneBasis,
          contractTwoBasis,
          user: session?.user?.name,
          cost_type
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-basis-cost-estimate'

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
    <div className='grid grid-cols-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8  '>
      <div className='col-span-2 flex pl-12 items-center justify-left gap-2 w-full'>
        <div className='mr-2'>
          Select Cost Type:
        </div>
        <div className={`${selectedCostType === 'FOB' ? ' bg-deep_blue text-white shadow-md' : 'bg-white text-black shadow-center-md'} w-fit  px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200`} onClick={() => setSelectedCostType('FOB')}>
          FOB
        </div>
        <div className={`${selectedCostType === 'CNF' ? ' bg-deep_blue text-white shadow-md' : 'bg-white text-black shadow-center-md'} w-fit  px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200`} onClick={() => setSelectedCostType('CNF')}>
          CNF
        </div>
      </div>
      <div className='relative flex flex-col items-center'>
        {/* <div className='absolute top-2 right-2 remove-me group' >

                  <img className=' w-[15px] h-[15px] self-center opacity-100 group-hover:hidden' width="15" height="15" src={"/i_G_SQ.png"}></img>
                  <img className=' w-[15px] h-[15px] self-center opacity-100 hidden group-hover:block' width="15" height="15" src={"/i.png"}></img>
                  <div className="z-50 pointer-events-none absolute flex flex-col justify-end left-1/2 w-[300px] h-[600px] -translate-x-full -translate-y-[615px] invisible group-hover:visible origin-bottom-right scale-0 group-hover:scale-100 transition-all duration-300 ">
                    <div className="shadow-center-2xl flex flex-col items-center px-4 pt-2 pb-4 rounded-2xl bg-deep_blue text-white text-center text-xs">
                      <img className="opacity-70" width="30px" src="/i_White.png" />
                      <div className="mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                      </div>
                    </div>
                  </div>
                </div> */}
        <InfoButton text='Find the most update FOB & CNF costs for different origins. For CNF we are always considering the same origin and same destination (main far east ports). ' />
        <div className='text-center font-semibold text-xl'>Current Basis Cost</div>
        <GroupedBarChart data={basisBarChartData(JSON.parse(basisData).filter((basis) => basis.cost_type === selectedCostType))} />
      </div>
      <div className='relative flex flex-col items-center'>
        <InfoButton text='Find the historical basis cost for both FOB and CNF. ' />
        <div className='-mb-2 text-center font-semibold text-xl'>Historical Basis Cost</div>
        <LineGraph decimalPlaces={0} verticalTooltip data={transformData(JSON.parse(basisData).filter((basis) => (basis.country === basisCountry) && (basis.cost_type === selectedCostType)))} xValue='time' yValue='value' monthsTicks={6} />
      </div>
      <div className='col-span-2 grid grid-cols-2 mb-4'>
        <div className='grid place-content-center'>
          {(session?.role === 'partner' || session?.role === 'admin') && (
            <div className='bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={() => setOpenBasisCostForm(true)}>
              Add Basis Cost Estimate
            </div>
          )}
          {openBasisCostForm && (
            <div className='absolute modal left-0 top-0 z-40'>
              <div className=' fixed grid place-content-center inset-0 z-40'>
                <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                  <div className='my-4 font-semibold text-lg'>
                    Add Basis Cost Estimate
                  </div>
                  <div className='w-full'>
                    <div className='flex flex-col gap-4'>
                      <SingleSelectDropdown
                        options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'WAF' }, { country: 'Australia' }]}
                        label='Country'
                        variable='country'
                        colour='bg-deep_blue'
                        onSelectionChange={(e) => setSelectedCountry(e.country)}
                        placeholder='Select Country'
                        searchPlaceholder='Search Countries'
                        includeLabel={false}
                      />
                      <SingleSelectDropdown
                        options={[{ value: 'FOB' }, { value: 'CNF' }]}
                        label='cost_type'
                        variable='value'
                        colour='bg-deep_blue'
                        onSelectionChange={(e) => setSelectedFormCostType(e.value)}
                        placeholder='Select cost type'
                        searchPlaceholder='Search cost types'
                        includeLabel={false}
                      />
                    </div>
                    <form className='mt-4 mb-4  grid grid-cols-2 gap-x-4 w-full' onSubmit={handleBasisFormSubmit}>
                      <div className='mb-4'>
                        <label
                          htmlFor='ctz23'
                          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                        >
                          CTZ23 Basis Estimate
                        </label>
                        <input
                          type='number'
                          id='ctz23'
                          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                          placeholder='Enter your estimate'
                        />
                      </div>
                      <div className='mb-4'>
                        <label
                          htmlFor='ctz24'
                          className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                        >
                          CTZ24 Basis Estimate
                        </label>
                        <input
                          type='number'
                          id='ctz24'
                          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                          placeholder='Enter your estimate'
                        />
                      </div>

                      <div className='col-span-2 flex justify-center'>
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
                <div onClick={() => setOpenBasisCostForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-center'>
          <div className='w-[200px]'>
            <SingleSelectDropdown
              options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'WAF' }, { country: 'Australia' }]}
              label='Country'
              variable='country'
              colour='bg-deep_blue'
              onSelectionChange={(e) => setBasisCountry(e.country)}
              placeholder='Select Country'
              searchPlaceholder='Search Countries'
              includeLabel={false}
              defaultValue='Brazil'
            />
          </div>
        </div>
      </div>
      <div className='col-span-1'>
        <Comments styling='mt-2 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Recent Basis')} session={session} section='Recent Basis' />
      </div>
      <div className='col-span-1'>
        <Comments styling='mt-2 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Historical Basis')} session={session} section='Historical Basis' />
      </div>
    </div>
  )
}

export default BasisCosts
