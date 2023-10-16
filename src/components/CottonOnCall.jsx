import { useState } from 'react'
import InfoButton from './infoButton'
import MultipleSelectDropdown from './multipleSelectDropdown'
import SingleSelectDropdown from './singleSelectDropdown'
import LineGraph from './lineGraph'
import LineGraphNotTime from './lineGraphNotTime'
import { getCottonOnCallSeasonData, getCottonOnCallWeekData } from '~/utils/getDataUtils'
import Comments from './comments'

const CottonOnCall = ({ getUniqueOptions, clientCottonOnCallData, commentsData, session }) => {
  const [Week, setWeek] = useState(1)
  const [Year, setYear] = useState('2324')
  const [WeekOrYear, setWeekOrYear] = useState('Year')
  const [cottonNamesArray, setCottonNamesArray] = useState(['October', 'December', 'March', 'May', 'July'])
  const [cottonSalesPropertiesArray, setCottonSalesPropertiesArray] = useState(['october_sales', 'december_sales', 'march_sales', 'may_sales', 'july_sales'])
  const [cottonPurchasesPropertiesArray, setCottonPurchasesPropertiesArray] = useState(['october_purchases', 'december_purchases', 'march_purchases', 'may_purchases', 'july_purchases'])
  return (
    <div className='flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>

      <div className='grid grid-cols-2 gap-y-8 -mb-8'>
        <div className='relative col-span-2 text-center text-xl font-semibold mb-4'>
          <InfoButton text='The Cotton On-Call Report shows the quantity of call cotton bought or sold on which the price has not been fixed, together with the respective futures on which the purchase or sale is based. Call cotton refers to physical cotton bought or sold, or contracted for purchase or sale at a price to be fixed later based upon a specified delivery month future’s price. This report is released every Thursday at 3:30 pm, Eastern time and reflects position as of the previous week.  ' />
          Cotton on Call
        </div>

        <div className='relative col-span-2 flex flex-col items-center'>

          <div className='col-span-3 grid grid-cols-3 w-full gap-x-4 px-8'>

            <div className='mb-4 w-full'>

              <SingleSelectDropdown
                options={[{ name: 'Week' }, { name: 'Year' }]}
                label='Week or Year'
                variable='name'
                colour='bg-deep_blue'
                onSelectionChange={(e) => setWeekOrYear(e.name)}
                placeholder='Select Week or Year'
                searchPlaceholder='Search Options'
                includeLabel={false}
                defaultValue='Year'
              />
            </div>
            {WeekOrYear === 'Year' && (
              <>
                <div className='mb-4 w-full'>

                  {/* <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="2324"
                          /> */}
                  <SingleSelectDropdown
                    options={getUniqueOptions(clientCottonOnCallData, 'season')}
                    label='Season'
                    variable='value'
                    colour='bg-deep_blue'
                    onSelectionChange={(e) => setYear(e.value)}
                    placeholder='Select a specific season'
                    searchPlaceholder='Search Options'
                    includeLabel={false}
                    defaultValue='2324'
                  />
                </div>
              </>
            )}
            {WeekOrYear === 'Week' && (
              <>
                <div className='mb-4 w-full'>

                  <SingleSelectDropdown
                    options={getUniqueOptions(clientCottonOnCallData, 'season_week')}
                    label='Week'
                    variable='value'
                    colour='bg-deep_blue'
                    onSelectionChange={(e) => setWeek(parseInt(e.value))}
                    placeholder='Select a specific week'
                    searchPlaceholder='Search Options'
                    includeLabel={false}
                    defaultValue='32'
                  />
                </div>
              </>
            )}
            <div className=''>
              <MultipleSelectDropdown
                options={[{ sales: 'october_sales', purchases: 'october_purchases', name: 'October' }, { sales: 'december_sales', purchases: 'december_purchases', name: 'December' }, { sales: 'march_sales', purchases: 'march_purchases', name: 'March' }, { sales: 'may_sales', purchases: 'may_purchases', name: 'May' }, { sales: 'july_sales', purchases: 'july_purchases', name: 'July' }]}
                variable='name'
                colour='bg-deep_blue'
                label='Variables'
                onSelectionChange={(e) => { if (e.length > 0) { setCottonSalesPropertiesArray(e.map((selection) => selection.sales)); setCottonPurchasesPropertiesArray(e.map((selection) => selection.purchases)); setCottonNamesArray(e.map((selection) => selection.name)) } }}
                        // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                placeholder='Select Variables'
                searchPlaceholder='Search Variables'
                includeLabel={false}
              />
            </div>
          </div>
        </div>
        <div className='relative flex flex-col items-center'>
          {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
          {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setSalesWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {salesWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setSalesYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {salesWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setSalesWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
          {WeekOrYear === 'Year' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Sales by week</div>
              <div className='mb-16 w-full'>

                {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), cottonSalesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Sales" /> */}
                <LineGraph decimalPlaces={0} weekNumberTicks data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season === Year), cottonSalesPropertiesArray, cottonNamesArray)} xValue='x' yValue='y' xAxisTitle='Week' yAxisTitle='Sales' />
              </div>
            </>
          )}
          {WeekOrYear === 'Week' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Sales by year</div>
              <div className='mb-16 w-full'>

                {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), cottonSalesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" /> */}
                <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week === Week), cottonSalesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle='Year' yAxisTitle='Sales' />
              </div>
            </>
          )}
        </div>
        <div className='relative flex flex-col items-center'>
          {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
          {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setPurchasesWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {purchasesWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setPurchasesYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {purchasesWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setPurchasesWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
          {WeekOrYear === 'Year' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Purchases by week</div>
              <div className='mb-16 w-full'>

                {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), cottonPurchasesPropertiesArray, cottonNamesArray)} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Purchases" /> */}
                <LineGraph decimalPlaces={0} weekNumberTicks data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season === Year), cottonPurchasesPropertiesArray, cottonNamesArray)} xValue='x' yValue='y' xAxisTitle='Week' yAxisTitle='Purchases' />
              </div>
            </>
          )}
          {WeekOrYear === 'Week' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Purchases by year</div>
              <div className='mb-16 w-full'>

                {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), cottonPurchasesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Purchases" /> */}
                <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week === Week), cottonPurchasesPropertiesArray, cottonNamesArray)} xDomain1={2001} xDomain2={2023} xAxisTitle='Year' yAxisTitle='Purchases' />
              </div>
            </>
          )}
        </div>
        <div className='relative flex flex-col items-center'>
          {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
          {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setTotalOnCallWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {totalOnCallWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setTotalOnCallYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {totalOnCallWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setTotalOnCallWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
          {WeekOrYear === 'Year' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Total on call sales and purchases by week</div>
              <div className='mb-16 w-full'>

                {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), ["total_on_call_sales", "total_on_call_purchases"], ["Total on Call Sales", "Total on Call Purchases"])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Total" /> */}
                <LineGraph decimalPlaces={0} weekNumberTicks data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season === Year), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xValue='x' yValue='y' xAxisTitle='Week' yAxisTitle='Total' />
              </div>
            </>
          )}
          {WeekOrYear === 'Week' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Total on call sales and purchases by year</div>
              <div className='mb-16 w-full'>

                {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), ["total_on_call_sales", "total_on_call_purchases"], ["Total on Call Sales", "Total on Call Purchases"])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Total" /> */}
                <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week === Week), ['total_on_call_sales', 'total_on_call_purchases'], ['Total on Call Sales', 'Total on Call Purchases'])} xDomain1={2001} xDomain2={2023} xAxisTitle='Year' yAxisTitle='Total' />
              </div>
            </>
          )}
        </div>
        <div className='relative flex flex-col items-center'>
          {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
          {/* <div className="col-span-3 grid grid-cols-2 w-full gap-x-4 px-8">

                    <div className="mb-4 w-full">

                      <SingleSelectDropdown
                        options={[{ name: "Week" }, { name: "Year" }]}
                        label="Week or Year"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setUOCWeekOrYear(e.name)}
                        placeholder="Select Week or Year"
                        searchPlaceholder="Search Options"
                        includeLabel={false}
                        defaultValue="Week"
                      />
                    </div>
                    {UOCWeekOrYear == "Week" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season")}
                            label="Season"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setUOCYear(e.value)}
                            placeholder="Select a specific season"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="0102"
                          />
                        </div>
                      </>
                    )}
                    {UOCWeekOrYear == "Year" && (
                      <>
                        <div className="mb-4 w-full">

                          <SingleSelectDropdown
                            options={getUniqueOptions(JSON.parse(cottonOnCallData), "season_week")}
                            label="Week"
                            variable="value"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setUOCWeek(parseInt(e.value))}
                            placeholder="Select a specific week"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            defaultValue="32"
                          />
                        </div>
                      </>
                    )}
                  </div> */}
          {WeekOrYear === 'Year' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Total net U OC position by week</div>
              <div className='mb-16 w-full'>

                {/* <LineGraph weekNumberTicks={true} data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == Year), ["total_net_u_oc_position"], ["Total Net U OC Position"])} xValue="x" yValue="y" xAxisTitle="Week" yAxisTitle="Net" /> */}
                <LineGraph decimalPlaces={0} weekNumberTicks data={getCottonOnCallWeekData(clientCottonOnCallData.filter((data) => data.season === Year), ['total_net_u_oc_position'], ['Total Net U OC Position'])} xValue='x' yValue='y' xAxisTitle='Week' yAxisTitle='Net' />
              </div>
            </>
          )}
          {WeekOrYear === 'Week' && (
            <>
              <div className='mt-6 -mb-2 font-semibold'>Total net U OC position by year</div>
              <div className='mb-16 w-full'>

                {/* <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == Week), ["total_net_u_oc_position"], ["Total Net U OC Position"])} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Net" /> */}
                <LineGraphNotTime data={getCottonOnCallSeasonData(clientCottonOnCallData.filter((data) => data.week === Week), ['total_net_u_oc_position'], ['Total Net U OC Position'])} xDomain1={2001} xDomain2={2023} xAxisTitle='Year' yAxisTitle='Net' />
              </div>
            </>
          )}
        </div>
      </div>
      <div className='col-span-1'>
        <Comments styling='mt-2 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Cotton On Call')} session={session} section='Cotton On Call' />
      </div>
    </div>
  )
}

export default CottonOnCall
