import InfoButton from './infoButton'
import LineGraphNotTime from './lineGraphNotTime'
import { getStudyData } from '~/utils/getDataUtils'
import SingleSelectDropdown from './singleSelectDropdown'
import { useState, useEffect } from 'react'
import { averageFutureContract } from '~/utils/calculateUtils'

const FutureContractsStudy = ({ futureContractsStudyData }) => {
  const [contract1, setContract1] = useState('')
  const [contract2, setContract2] = useState('')
  const [contract3, setContract3] = useState('')

  useEffect(() => {
    setContract1(JSON.parse(futureContractsStudyData)[2]?.year ?? '')
    setContract2(JSON.parse(futureContractsStudyData)[1]?.year ?? '')
    setContract3(JSON.parse(futureContractsStudyData)[0]?.year ?? '')
  }, [futureContractsStudyData])

  return (
    <>

      <div className='flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12'>
        <div className='relative w-full text-center text-xl font-semibold mt-4'>
          <InfoButton text='A historical look into the December futures contract. ' />
          Future Contracts Study
        </div>
        {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
        <LineGraphNotTime verticalTooltip={false} xDomain1={0} xDomain2={12} data={(contract1 && contract2 && contract3) ? getStudyData(JSON.parse(futureContractsStudyData).find((contract) => contract.year === contract1), JSON.parse(futureContractsStudyData).find((contract) => contract.year === contract2), JSON.parse(futureContractsStudyData).find((contract) => contract.year === contract3)) : []} graphWidth={1000} graphHeight={600} />
      </div>
      <div className='text-center text-2xl mt-4'>Please Select the Seasons you want to compare</div>
      <div className='grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl'>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(futureContractsStudyData)}
            label='Contract'
            variable='year'
            onSelectionChange={(e) => setContract1(e.year)}
            placeholder='Select Contract'
            searchPlaceholder='Search Contracts'
            includeLabel={false}
            defaultValue={contract1}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
          {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season1)?.inverse_season}</div>
                </div> */}
        </div>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(futureContractsStudyData)}
            label='Season'
            variable='year'
            colour='bg-deep_blue'
            onSelectionChange={(e) => setContract2(e.year)}
            placeholder='Select Season'
            searchPlaceholder='Search Contracts'
            includeLabel={false}
            defaultValue={contract2}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
          {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season2)?.inverse_season}</div>
                </div> */}
        </div>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(futureContractsStudyData)}
            label='Contract'
            variable='year'
            colour='bg-turquoise'
            onSelectionChange={(e) => setContract3(e.year)}
            placeholder='Select Contract'
            searchPlaceholder='Search Contracts'
            includeLabel={false}
            defaultValue={contract3}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
          {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season3)?.inverse_season}</div>
                </div> */}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-x-8 m-8'>
        <div className='flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4'>
          <div>Average High (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
          <div>Average Low (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
          <div>Average Price Range (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
          <div>Average High (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'high')).toFixed(2)}</div>
          <div>Average Low (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'low')).toFixed(2)}</div>
          <div>Average Price Range (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), 'price_range_between_high_and_low')).toFixed(2)}</div>
        </div>
      </div>
    </>
  )
}

export default FutureContractsStudy
