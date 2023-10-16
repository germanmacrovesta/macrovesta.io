import React, { useState } from 'react'
import SingleSelectDropdown from './singleSelectDropdown'
import MultipleSelectDropdown from './multipleSelectDropdown'
import InfoButton from './infoButton'
import { getSupplyAndDemandData } from '~/utils/getDataUtils'
import LineGraph from './lineGraph'
import Comments from './comments'

const SupplyAndDemmand = ({ supplyAndDemandData, getUniqueOptions, commentsData, session }) => {
  const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = useState(new Date('2000-01-01').toISOString())
  const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = useState(new Date('2023-12-31').toISOString())
  const [selectedSupplyAndDemandSeason, setSelectedSupplyAndDemandSeason] = useState('20/21')
  const [supplyAndDemandPropertiesArray, setSupplyAndDemandPropertiesArray] = useState(['production_usda'])
  const [supplyAndDemandNamesArray, setSupplyAndDemandNamesArray] = useState(['Production USDA'])
  const [supplyAndDemandProjectedPropertiesArray, setSupplyAndDemandProjectedPropertiesArray] = useState(['production_usda', 'production_eap'])
  const [supplyAndDemandProjectedNamesArray, setSupplyAndDemandProjectedNamesArray] = useState(['Production USDA', 'Production EAP'])

  return (
    <div className='flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>

      <div className='grid grid-cols-2 -mb-8'>
        <div className='relative col-span-2 text-center text-xl font-semibold mb-4'>
          {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
          Supply and Demand
        </div>
        <div className='col-span-3 grid grid-cols-3 w-full gap-x-4 px-8'>

          {/* <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedSupplyAndDemandStartDate} date={selectedSupplyAndDemandStartDate} formatter={formatter} />
                  </div>
                  <div className="mb-4 w-full">
                    <DateField label='Start Date' setDate={setSelectedSupplyAndDemandEndDate} date={selectedSupplyAndDemandEndDate} formatter={formatter} />
                  </div> */}
          <div className='mb-4 w-full'>
            <SingleSelectDropdown
              options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 0, 1).toISOString() }))}
              label='Week'
              variable='year'
              colour='bg-deep_blue'
              onSelectionChange={(e) => setSelectedSupplyAndDemandStartDate(e.value)}
              placeholder='Select year'
              searchPlaceholder='Search Options'
              includeLabel={false}
              defaultValue='2000'
            />
          </div>
          <div className='mb-4 w-full'>
            <SingleSelectDropdown
              options={Array.from({ length: 2023 - 1981 + 1 }, (_, i) => ({ year: `${1981 + i}`, value: new Date(1981 + i, 12, 31).toISOString() }))}
              label='Week'
              variable='year'
              colour='bg-deep_blue'
              onSelectionChange={(e) => setSelectedSupplyAndDemandEndDate(e.value)}
              placeholder='Select year'
              searchPlaceholder='Search Options'
              includeLabel={false}
              defaultValue='2023'
            />
          </div>
          <div className='mb-4 w-full'>

            <MultipleSelectDropdown
              options={[{ property: 'beginning_stocks_usda', name: 'Beginning Stocks' }, { property: 'production_usda', name: 'Production' }, { property: 'imports_usda', name: 'Imports' }, { property: 'domestic_use_usda', name: 'Domestic Use' }, { property: 'exports_usda', name: 'Exports' }, { property: 'ending_stocks_usda', name: 'Ending Stocks' }]}
              variable='name'
              colour='bg-deep_blue'
              label='Variables'
              onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandPropertiesArray(e.map((selection) => selection.property)); setSupplyAndDemandNamesArray(e.map((selection) => selection.name)) } }}
                      // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
              placeholder='Select Variables'
              searchPlaceholder='Search Variables'
              includeLabel={false}
            />
          </div>
        </div>

        <div className='col-span-2 flex flex-col items-center'>
          {/* {commitmentWeekOrYear == "Year" && (
                    <>
                      <div className="mt-6 -mb-2 font-semibold">Supply and Demand by Week</div>
                      <div className="mb-16 w-full">

                        <LineGraphNotTime data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) == commitmentYear), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain2={52} xAxisTitle="Week" />
                      </div>
                    </>
                  )} */}
          {/* {commitmentWeekOrYear == "Week" && (
                    <> */}
          <div className='relative w-full text-center mt-6 -mb-2 font-semibold'>
            <InfoButton text='The World Agricultural Supply and Demand Estimates (WASDE) is released monthly and provides annual forecasts for supply and use of U.S. and world cotton. ' />
            Historical WASDE
          </div>
          <div className='mb-16 w-full'>
            {/* <LineGraph verticalTooltip={true} data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (new Date(data.date).getMonth() == new Date().getMonth() - 1) && (data.date < selectedSupplyAndDemandEndDate) && (data.date > selectedSupplyAndDemandStartDate)), supplyAndDemandPropertiesArray, supplyAndDemandNamesArray)} graphWidth={1000} /> */}
            <LineGraph verticalTooltip data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (data.date < selectedSupplyAndDemandEndDate) && (data.date > selectedSupplyAndDemandStartDate)), supplyAndDemandPropertiesArray, supplyAndDemandNamesArray)} graphWidth={1000} />
          </div>
          <div className='col-span-3 grid grid-cols-2 w-full gap-x-4 px-8'>

            <div className='mb-4 w-full'>
              <SingleSelectDropdown
                options={getUniqueOptions(JSON.parse(supplyAndDemandData), 'season').filter((uniqueOption) => {
                  if (parseInt(uniqueOption?.value.slice(0, 2)) > 19 && parseInt(uniqueOption?.value.slice(0, 2)) < 80) {
                    return true
                  } else {
                    return false
                  }
                })}
                label='Week'
                variable='value'
                colour='bg-deep_blue'
                onSelectionChange={(e) => setSelectedSupplyAndDemandSeason(e.value)}
                placeholder='Select specific season'
                searchPlaceholder='Search Options'
                includeLabel={false}
                defaultValue='22/23'
              />
            </div>
            <div className='mb-4 w-full'>

              <MultipleSelectDropdown
                options={[{ property: 'beginning_stocks', name: 'Beginning Stocks' }, { property: 'production', name: 'Production' }, { property: 'imports', name: 'Imports' }, { property: 'domestic_use', name: 'Domestic Use' }, { property: 'exports', name: 'Exports' }, { property: 'ending_stocks', name: 'Ending Stocks' }]}
                variable='name'
                colour='bg-deep_blue'
                label='Variables'
                onSelectionChange={(e) => { if (e.length > 0) { setSupplyAndDemandProjectedPropertiesArray(e.reduce((acc, obj) => { acc.push(`${obj.property}_usda`); acc.push(`${obj.property}_eap`); return acc }, [])); setSupplyAndDemandProjectedNamesArray(e.reduce((acc, obj) => { acc.push(`${obj.name} USDA`); acc.push(`${obj.name} EAP`); return acc }, [])) } }}
                        // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
                placeholder='Select Variables'
                searchPlaceholder='Search Variables'
                includeLabel={false}
              />
            </div>
          </div>
          <div className='relative w-full text-center mt-6 -mb-2 font-semibold'>
            <InfoButton text={`Here you will find a graph showing historical data of many different variables included on the report such as production and consumption. 
Here is the difference between USDA and Macrovesta. 
`}
            />
            Supply and Demand by Season
          </div>
          <div className='mb-16 w-full'>
            <LineGraph verticalTooltip data={getSupplyAndDemandData(JSON.parse(supplyAndDemandData).filter((data) => (data.season === selectedSupplyAndDemandSeason)), supplyAndDemandProjectedPropertiesArray, supplyAndDemandProjectedNamesArray)} graphWidth={1000} />
          </div>
          {/* </>
                  )} */}
        </div>
      </div>
      <div className='col-span-1'>
        <Comments styling='mt-2 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Supply And Demand')} session={session} section='Supply And Demand' />
      </div>
      c
    </div>
  )
}

export default SupplyAndDemmand
