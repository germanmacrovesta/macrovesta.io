import { useState, useEffect } from 'react'
import InfoButton from './infoButton'
import DateField from './dateField'
import MultipleSelectDropdown from './multipleSelectDropdown'
import LineGraph from './lineGraph'
import Comments from './comments'
import { parseDate } from '@internationalized/date'
import { getDateSixMothAgo, getTodayDate } from '~/utils/dateUtils'
import { getUSExportSalesData } from '~/utils/getDataUtils'

const USExportSales = ({ formatter, commentsData, session }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(parseDate(getDateSixMothAgo()))
  const [selectedEndDate, setSelectedEndDate] = useState(parseDate(getTodayDate()))
  const [exportPropertiesArray, setExportPropertiesArray] = useState(['net_sales', 'next_marketing_year_net_sales'])
  const [exportNamesArray, setExportNamesArray] = useState(['Net Sales', 'Next Marketing Year Net Sales'])
  const [clientUSExportSalesData, setClientUSExportSalesData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call using the fetch method
        const response = await fetch('/api/get-us-export-sales-data')

        // Check if the request was successful
        if (response.ok) {
          // Parse the JSON data from the response
          const result = await response.json()

          // Update the state with the fetched data
          setClientUSExportSalesData(result)
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
    <>
      <div className='relative flex flex-col col-span-1 bg-[#ffffff] p-4 rounded-xl shadow-lg'>
        <div className='relative grid grid-cols-2'>
          <InfoButton text={`Weekly exports, accumulated exports, net sales, and outstanding sales for the current marketing year and net sales and outstanding sales for next marketing year are available for cotton since 1990.
U.S Export Sales Report is released every Thursday and highlights data as of the week before, also ending on Thursday. 
`}
          />
          <div className='col-span-2 text-center text-xl font-semibold mb-4'>
            US Exports Sales
          </div>
          <div className='col-span-2 grid grid-cols-2 w-full gap-x-4 px-8'>
            <div className='mb-4 w-full'>
              <DateField label='Start Date' setDate={setSelectedStartDate} date={selectedStartDate} formatter={formatter} />
            </div>
            <div className='mb-4 w-full'>
              <DateField label='Start Date' setDate={setSelectedEndDate} date={selectedEndDate} formatter={formatter} />
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
                options={[{ property: 'weekly_exports', name: 'Weekly Exports' }, { property: 'accumulated_exports', name: 'Accumulated Exports' }, { property: 'net_sales', name: 'Net Sales' }, { property: 'next_marketing_year_net_sales', name: 'Next Marketing Year Net Sales' }, { property: 'outstanding_sales', name: 'Outstanding Sales' }, { property: 'next_marketing_year_outstanding_sales', name: 'Next Marketing Year Outstanding Sales' }]}
                variable='name'
                colour='bg-deep_blue'
                label='Variables'
                onSelectionChange={(e) => { if (e.length > 0) { setExportPropertiesArray(e.map((selection) => selection.property)); setExportNamesArray(e.map((selection) => selection.name)) } }}
                        // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                placeholder='Select Variables'
                searchPlaceholder='Search Variables'
                includeLabel={false}
              />
            </div>
          </div>

          <div className='col-span-2 flex flex-col items-center w-full'>
            <div className='mt-6 -mb-2 font-semibold'>US Export Sales by Week</div>
            <div className='mb-4 w-full'>

              {/* <LineGraph verticalTooltip={true} data={getUSExportSalesData(JSON.parse(exportSalesData).filter((data) => data.week_ending < selectedEndDate && data.week_ending > selectedStartDate), exportPropertiesArray, exportNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" /> */}
              <LineGraph decimalPlaces={0} verticalTooltip data={getUSExportSalesData(clientUSExportSalesData.filter((data) => data.week_ending < selectedEndDate && data.week_ending > selectedStartDate), exportPropertiesArray, exportNamesArray)} xValue='x' yValue='y' xAxisTitle='Week' />
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
        <Comments styling='px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Export Sales')} session={session} section='Export Sales' commentLength={800} />
      </div>
      {/* <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <img src="/Charts_Under_Construction_Half_width.png" />
              </div> */}
    </>
  )
}

export default USExportSales
