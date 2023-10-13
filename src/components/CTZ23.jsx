import DateField from './dateField'
import InfoButton from './infoButton'
import LineGraph from './lineGraph'
import Comments from './comments'
import { useState } from 'react'
import { Tabs, Tab, Select, SelectItem } from '@nextui-org/react'
import { parseDate } from '@internationalized/date'
import { getTodayDate, getOneYearAgoDate } from '~/utils/dateUtils'
import { calculateSpread } from '~/utils/calculateUtils'

const CTZ23 = ({ formatter, commentsData, session, contractData }) => {
  // TODO: Fetch data when button is clicked, only initial data is required for show initial component (+ performance)
  // TODO: Try to structure and parse data before component receive it. Component must receive data simple as posible.
  const [selectedCottonContractsStartDate, setSelectedCottonContractsStartDate] = useState(parseDate(getOneYearAgoDate()))
  const [selectedCottonContractsEndDate, setSelectedCottonContractsEndDate] = useState(parseDate(getTodayDate()))
  const [contractParameter, setContractParameter] = useState('close')

  function getCommentsForValue (value) {
    const commentsMapping = {
      CTZ23: 'Current Contract',
      CTH24: 'Nearby Spread',
      CTK24: 'Second Spread',
      CTN24: 'Third Spread',
      CTZ24: 'Fourth Spread'
    }

    return commentsMapping[value]
  }

  const tabs = Object.keys(contractData).map((key, index) => ({
    id: (index + 1).toString(),
    title: key,
    comments: getCommentsForValue(key)
  })).sort((a, b) => (a.title === 'CTZ23' ? -1 : b.title === 'CTZ23' ? 1 : 0))

  const dropdownOptions = [{ name: 'Open', parameter: 'open' }, { name: 'Close', parameter: 'close' }, { name: 'High', parameter: 'high' }, { name: 'Low', parameter: 'low' }]

  return (
    <>
      <div className='auto-row-[300px] gap-x-8 gap-y-4 pb-12 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-4 py-2 mb-8 mx-8 relative'>
        <InfoButton text='This section analyses technically what has happened to the front month of cotton as well as relevant futures spreads over the past week.' />
        <div className='flex w-full justify-around mt-10 relative'>
          <div className='flex flex-col flex-1 relative'>

            <div className='flex absolute items-center ml-10'>
              <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsStartDate} date={selectedCottonContractsStartDate} formatter={formatter} />
              <p className='px-2'>to</p>
              <DateField yearOptions={[-2, 0]} label='Start Date' setDate={setSelectedCottonContractsEndDate} date={selectedCottonContractsEndDate} formatter={formatter} />
            </div>

            <Tabs aria-label='Dynamic tabs' items={tabs} classNames={{ base: 'absolute right-10', panel: 'mt-10' }}>
              {(item) => (
                <Tab key={item.id} title={item.title} className=''>

                  <div className='flex flex-1 items-center justify-center relative mt-4'>
                    <div className='font-semibold'>{item.title !== 'CTZ23' && 'CTZ23/'}{item.title}</div>
                    {item.title === 'CTZ23' && (
                      <Select
                        radius='md'
                        label='Select a parameter'
                        className='max-w-xs absolute right-10'
                        onChange={(e) => setContractParameter(e.target.value)}
                        size='sm'
                      >
                        {dropdownOptions.map((option) => (
                          <SelectItem key={option.parameter} value={option.parameter}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>

                  {item.title === 'CTZ23'
                    ? (
                      <LineGraph
                        verticalTooltip
                        data={contractParameter !== null && [
                          {
                            name: item.title,
                            data: JSON.parse(contractData[item.title]).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate),
                            noCircles: true,
                            noHover: true
                          }]}
                        monthsTicks={6}
                        xValue='datetime'
                        yValue={contractParameter}
                        graphWidth={1000}
                        graphHeight={400}
                      />
                      )
                    : (
                      <LineGraph
                        verticalTooltip
                        data={calculateSpread(JSON.parse(contractData.CTZ23).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), JSON.parse(contractData[item.title]).filter((data) => data.datetime < selectedCottonContractsEndDate && data.datetime > selectedCottonContractsStartDate), `CTZ23 / ${item.title}`)}
                      />
                      )}

                  <Comments styling='mt-8 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === item.comments)} session={session} section={item.comments} commentLength={800} />
                </Tab>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

export default CTZ23
