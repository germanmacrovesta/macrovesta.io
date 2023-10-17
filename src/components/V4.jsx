import { useEffect, useState } from 'react'
import InfoButton from './infoButton'
import LineGraphNotTime from './lineGraphNotTime'
import { getSeasonData } from '~/utils/getDataUtils'
import SingleSelectDropdown from './singleSelectDropdown'
import { parseDateString } from '~/utils/dateUtils'

const V4 = ({ seasonsData }) => {
  const [season1, setSeason1] = useState('')
  const [season2, setSeason2] = useState('')
  const [season3, setSeason3] = useState('')

  useEffect(() => {
    setSeason1(JSON.parse(seasonsData)[2]?.season ?? '')
    setSeason2(JSON.parse(seasonsData)[1]?.season ?? '')
    setSeason3(JSON.parse(seasonsData)[0]?.season ?? '')
    // setContract1(JSON.parse(seasonsData)[2]?.season ?? '')
    // setContract2(JSON.parse(seasonsData)[1]?.season ?? '')
    // setContract3(JSON.parse(seasonsData)[0]?.season ?? '')
  }, [seasonsData])

  return (
    <>

      <div className='flex flex-col items-center bg-[#ffffff] p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12'>
        <div className='relative w-full text-center text-xl font-semibold mt-4'>
          <InfoButton text='A historical look into different seasons where you can analyse them side-to-side. ' />
          V4
        </div>
        {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
        <LineGraphNotTime verticalTooltip={false} data={(season1 && season2 && season3) ? getSeasonData(JSON.parse(seasonsData).find((season) => season.season === season1), JSON.parse(seasonsData).find((season) => season.season === season2), JSON.parse(seasonsData).find((season) => season.season === season3)) : []} graphWidth={1000} graphHeight={600} />
      </div>
      <div className='text-center text-2xl mt-4'>Please Select the Seasons you want to compare</div>
      <div className='grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl'>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(seasonsData)}
            label='Season'
            variable='season'
            onSelectionChange={(e) => setSeason1(e.season)}
            placeholder='Select Season'
            searchPlaceholder='Search Seasons'
            includeLabel={false}
            defaultValue={season1}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
          <div className='flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8'>
            <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season === season1)?.low_price}</div>
            <div>High Price: {JSON.parse(seasonsData).find((season) => season.season === season1)?.high_price}</div>
            <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season1)?.date_of_low)}</div>
            <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season1)?.date_of_high)}</div>
            <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.month_of_low}</div>
            <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season === season1)?.month_of_high}</div>
            <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.calendar_week_of_low}</div>
            <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season === season1)?.calendar_week_of_high}</div>
            <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.range_between_high_low}</div>
            <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season === season1)?.rank_of_price_range}</div>
            <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.percentage_rate_to_low}</div>
            <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.day_range_between_high_low}</div>
            <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season1)?.rank_between_high_low}</div>
            <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season === season1)?.inverse_season}</div>
          </div>
        </div>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(seasonsData)}
            label='Season'
            variable='season'
            colour='bg-deep_blue'
            onSelectionChange={(e) => setSeason2(e.season)}
            placeholder='Select Season'
            searchPlaceholder='Search Seasons'
            includeLabel={false}
            defaultValue={season2}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
          <div className='flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8'>
            <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season === season2)?.low_price}</div>
            <div>High Price: {JSON.parse(seasonsData).find((season) => season.season === season2)?.high_price}</div>
            <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season2)?.date_of_low)}</div>
            <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season2)?.date_of_high)}</div>
            <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.month_of_low}</div>
            <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season === season2)?.month_of_high}</div>
            <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.calendar_week_of_low}</div>
            <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season === season2)?.calendar_week_of_high}</div>
            <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.range_between_high_low}</div>
            <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season === season2)?.rank_of_price_range}</div>
            <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.percentage_rate_to_low}</div>
            <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.day_range_between_high_low}</div>
            <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season2)?.rank_between_high_low}</div>
            <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season === season2)?.inverse_season}</div>
          </div>
        </div>
        <div className='flex flex-col'>
          <SingleSelectDropdown
            options={JSON.parse(seasonsData)}
            label='Season'
            variable='season'
            colour='bg-turquoise'
            onSelectionChange={(e) => setSeason3(e.season)}
            placeholder='Select Season'
            searchPlaceholder='Search Seasons'
            includeLabel={false}
            defaultValue={season3}
          />
          {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
          <div className='flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8'>
            <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season === season3)?.low_price}</div>
            <div>High Price: {JSON.parse(seasonsData).find((season) => season.season === season3)?.high_price}</div>
            <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season3)?.date_of_low)}</div>
            <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season === season3)?.date_of_high)}</div>
            <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.month_of_low}</div>
            <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season === season3)?.month_of_high}</div>
            <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.calendar_week_of_low}</div>
            <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season === season3)?.calendar_week_of_high}</div>
            <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.range_between_high_low}</div>
            <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season === season3)?.rank_of_price_range}</div>
            <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.percentage_rate_to_low}</div>
            <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.day_range_between_high_low}</div>
            <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season === season3)?.rank_between_high_low}</div>
            <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season === season3)?.inverse_season}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default V4
