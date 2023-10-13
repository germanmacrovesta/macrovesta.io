import DateField from './dateField'
import InfoButton from './infoButton'
import MultipleSelectDropdown from './multipleSelectDropdown'
import LineGraph from './lineGraph'
import Comments from './comments'
import { useState, useEffect } from 'react'
import { parseDate } from '@internationalized/date'
import { getTodayDate } from '~/utils/dateUtils'
import { getAIndexData } from '~/utils/getDataUtils'

const DomesticPrices = ({ formatter, commentsData, session }) => {
  const [selectedIndexStartDate, setSelectedIndexStartDate] = useState(parseDate('2023-01-01'))
  const [selectedIndexEndDate, setSelectedIndexEndDate] = useState(parseDate(getTodayDate()))
  const [indexPropertiesArray, setIndexPropertiesArray] = useState(['a_index', 'ice_highest_open_interest_17_months'])
  const [indexNamesArray, setIndexNamesArray] = useState(['A-Index', 'Ice Highest'])
  const [clientAIndexData, setClientAIndexData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using the fetch method
        const response = await fetch('/api/get-a-index-data')

        // Check if the request was successful
        if (response.ok) {
          // Parse the JSON data from the response
          const result = await response.json()

          // Update the state with the fetched data
          setClientAIndexData(result)
        } else {
          console.error(`API request failed with status ${response.status}`)
        }
      } catch (error) {
        console.error(`An error occurred while fetching data: ${error}`)
      }
    }

    // Call the fetchData function
    fetchData()
  }, [])

  return (
    <div className='relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg mx-8'>
      <div className='relative grid grid-cols-2'>
        <InfoButton text='In this section, you can use the multi-select dropdown menu to pick which markets you would like to compare. At the moment, the markets available are MCX (Indian), CEPEA (Brazilian), CC-Index (China), and ICE (American). The A-INDEX is intended to be representative of the level of offering prices on the international raw cotton market. It is an average of the cheapest five quotations from a selection of the principal upland cottons traded internationally.' />
        <div className='col-span-2 text-center text-xl font-semibold mb-4'>
          Domestic Prices
        </div>
        <div className='col-span-2 grid grid-cols-2 w-full gap-x-4 px-8'>
          <div className='mb-4 w-full'>
            <DateField yearOptions={[-28, 0]} label='Start Date' setDate={setSelectedIndexStartDate} date={selectedIndexStartDate} formatter={formatter} />
          </div>
          <div className='mb-4 w-full'>
            <DateField yearOptions={[-28, 0]} label='Start Date' setDate={setSelectedIndexEndDate} date={selectedIndexEndDate} formatter={formatter} />
          </div>

          {/* <div className="mb-4 w-full">

            <SingleSelectDropdown
              options={[{ name: "Week" }, { name: "Year" }]}
              label="Week or Year"
              variable="name"
              colour="bg-deep_blue"
              onSelectionChange={(e) => setCommitmentWeekOrYear(e.name)}
              placeholder="Select Week or Year"
              searchPlaceholder="Search Options"
              includeLabel={false}
              defaultValue="Week"
            />
          </div>
          {commitmentWeekOrYear == "Year" && (
            <>
              <div className="mb-4 w-full">

                <SingleSelectDropdown
                  options={getUniqueOptions(JSON.parse(commitmentData), "calendar_year")}
                  label="Year"
                  variable="value"
                  colour="bg-deep_blue"
                  onSelectionChange={(e) => setCommitmentYear(parseInt(e.value))}
                  placeholder="Select a specific year"
                  searchPlaceholder="Search Options"
                  includeLabel={false}
                  defaultValue="2010"
                />
              </div>
            </>
          )}
          {commitmentWeekOrYear == "Week" && (
            <>
              <div className="mb-4 w-full">

                <SingleSelectDropdown
                  options={getUniqueOptions(JSON.parse(commitmentData), "week")}
                  label="Week"
                  variable="value"
                  colour="bg-deep_blue"
                  onSelectionChange={(e) => setCommitmentWeek(parseInt(e.value))}
                  placeholder="Select a specific week"
                  searchPlaceholder="Search Options"
                  includeLabel={false}
                  defaultValue="1"
                />
              </div>
            </>
          )} */}
          <div className='col-span-2 mb-4 w-full'>

            <MultipleSelectDropdown
              options={[{ property: 'a_index', name: 'A-Index' }, { property: 'ice_highest_open_interest_17_months', name: 'Ice Highest' }, { property: 'cc_index', name: 'CC Index' }, { property: 'mcx', name: 'MCX' }, { property: 'cepea', name: 'CEPEA' }]}
              variable='name'
              colour='bg-deep_blue'
              label='Variables'
              onSelectionChange={(e) => { if (e.length > 0) { setIndexPropertiesArray(e.map((selection) => selection.property)); setIndexNamesArray(e.map((selection) => selection.name)) } }}
            // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
              placeholder='Select Variables'
              searchPlaceholder='Search Variables'
              includeLabel={false}
            />
          </div>
        </div>

        <div className='col-span-2 flex flex-col items-center w-full'>
          <div className='mt-6 -mb-2 font-semibold'>Domestic Prices by Week</div>
          <div className='mb-4 w-full'>

            {/* <LineGraph verticalTooltip={true} data={getAIndexData(JSON.parse(aIndexData).filter((data) => data.date < selectedIndexEndDate && data.date > selectedIndexStartDate), indexPropertiesArray, indexNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" /> */}
            <LineGraph showPositiveSign={false} verticalTooltip data={getAIndexData(clientAIndexData.filter((data) => data.date < selectedIndexEndDate && data.date > selectedIndexStartDate), indexPropertiesArray, indexNamesArray)} xValue='x' yValue='y' xAxisTitle='Week' />
          </div>
          {/* {commitmentWeekOrYear == "Year" && (
            <>
              <div className="mt-6 -mb-2 font-semibold">US Export Sales by Week</div>
              <div className="mb-16 w-full">

                <LineGraph data={getUSExportSalesWeekData(JSON.parse(exportSalesData).filter((data) => parseInt(data.calendar_year) == commitmentYear), commitmentPropertiesArray, commitmentNamesArray)} xDomain2={52} xAxisTitle="Week" />
              </div>
            </>
          )}
          {commitmentWeekOrYear == "Week" && (
            <>
              <div className="mt-6 -mb-2 font-semibold">US Export Sales by Year</div>
              <div className="mb-16 w-full">

                <LineGraphNotTime data={getUSExportSalesSeasonData(JSON.parse(exportSalesData).filter((data) => parseInt(data.week) == commitmentWeek), commitmentPropertiesArray, commitmentNamesArray)} xDomain1={2009} xDomain2={2023} xAxisTitle="Year" />
              </div>
            </>
          )} */}
        </div>
      </div>
      <Comments styling='px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'A-Index')} session={session} section='A-Index' />
    </div>
  )
}

export default DomesticPrices
