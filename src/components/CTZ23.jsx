import DateField from './dateField'
import InfoButton from './infoButton'
import LineGraph from './lineGraph'
import SingleSelectDropdown from './singleSelectDropdown'
import Comments from './comments'
import { useEffect, useState } from 'react'
import { object } from 'zod'
import Spinner from './Spinner'

const CTZ23 = ({ setSelectedCottonContractsStartDate, selectedCottonContractsStartDate, formatter, setSelectedCottonContractsEndDate, selectedCottonContractsEndDate, contractParameter, setContractParameter, commentsData, session, calculateSpread, contractData }) => {
  // TODO: Try to structure and parse data before component receive it
  // TODO: Fetch data when button is clicked, only initial data is required for show initial component (+ performance)
  // TODO: Parameter change only when CTZ23 is showing
  const { CTH24, CTK24, CTN24, CTZ24, CTZ23 } = contractData // Array of spreads from server
  const [currentChart, setCurrentChart] = useState('CTZ23')

  const handleClick = (contract) => {
    setCurrentChart(contract)
    console.log(currentChart)
  }

  useEffect(() => {
    if (currentChart) {
      console.log(currentChart)
    }
  }, [currentChart])

  return (
    <>
      <div className='auto-row-[300px] gap-x-8 gap-y-4 pb-12 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-4 py-2 mb-8 mx-8'>
        <div className='flex w-full justify-around'>
          <div className='flex col-span-2 gap-x-4 mx-8 mt-4'>
            <div className='mb-4'>
              <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsStartDate} date={selectedCottonContractsStartDate} formatter={formatter} />
            </div>
            <div className='mb-4'>
              <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsEndDate} date={selectedCottonContractsEndDate} formatter={formatter} />
            </div>
          </div>
          <div className='w-[100px] flex mb-4 mt-4'>
            <SingleSelectDropdown
              options={[{ name: 'Open', parameter: 'open' }, { name: 'Close', parameter: 'close' }, { name: 'High', parameter: 'high' }, { name: 'Low', parameter: 'low' }]}
              label='Parameter'
              variable='name'
              colour='bg-deep_blue'
              onSelectionChange={(e) => setContractParameter(e.parameter)}
              placeholder='Select Parameter'
              searchPlaceholder='Search Parameter'
              includeLabel={false}
              defaultValue='Close'
            />
          </div>
          <div className='flex gap-4 mx-8'>
            {['CTZ23', ...Object.keys(contractData).filter(contract => contract !== 'CTZ23')].map((contract) => (
              <button onClick={() => handleClick(contract)} className={`rounded-md mb-4 mt-4 px-2 ${contract === 'CTZ23' ? 'bg-orange-700' : 'bg-deep_blue'} text-white`} key={contract}>
                {contract}
              </button>
            ))}
          </div>
        </div>
        {!currentChart && (
          <Spinner />
        )}
        {/* Initial Spread */}
        {currentChart === 'CTZ23' && (
          <div className='relative flex flex-col col-span-2 items-center'>
            <InfoButton text='This section analyses technically what has happened to the front month of cotton as well as relevant futures spreads over the past week.' />
            <div className='mt-6 -mb-2 font-semibold'>CTZ23</div>
            <LineGraph verticalTooltip data={contractParameter != null ? [{ name: 'CTZ23', data: JSON.parse(CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), noCircles: true, noHover: true }] : []} monthsTicks={6} xValue='datetime' yValue={contractParameter} graphWidth={1000} graphHeight={400} />
            <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Current Contract')} session={session} section='Current Contract' commentLength={800} />
          </div>
        )}
        {currentChart === 'CTZ24' && (
          <div className='relative flex flex-col items-center'>
            {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
            <div className='mt-6 -mb-2 font-semibold'>CTZ23 / CTZ24 Spread</div>
            <LineGraph verticalTooltip data={calculateSpread(JSON.parse(CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTZ24).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTZ24 Spread')} />
            <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Fourth Spread')} session={session} section='Fourth Spread' />
          </div>
        )}
        {currentChart === 'CTN24' && (
          <div className='relative flex flex-col items-center'>
            {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
            <div className='mt-6 -mb-2 font-semibold'>CTZ23 / CTN24 Spread</div>
            <LineGraph verticalTooltip data={calculateSpread(JSON.parse(CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTN24).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTN24 Spread')} />
            <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Third Spread')} session={session} section='Third Spread' />
          </div>
        )}
        {currentChart === 'CTK24' && (
          <div className='relative flex flex-col items-center'>
            {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
            <div className='mt-6 -mb-2 font-semibold'>CTZ23 / CTK24 Spread</div>
            <LineGraph verticalTooltip data={calculateSpread(JSON.parse(CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTK24).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTK24 Spread')} monthsTicks={6} />
            <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Second Spread')} session={session} section='Second Spread' />
          </div>
        )}
        {currentChart === 'CTH24' && (
          <div className='relative flex flex-col items-center'>
            {/* <InfoButton text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`} /> */}
            <div className='mt-6 -mb-2 font-semibold'>CTZ23 / CTH24 Spread</div>
            <LineGraph verticalTooltip data={calculateSpread(JSON.parse(CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(CTH24).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), 'CTZ23 / CTH24 Spread')} monthsTicks={6} />
            <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Nearby Spread')} session={session} section='Nearby Spread' />
          </div>
        )}
      </div>
    </>
  )
}

export default CTZ23
