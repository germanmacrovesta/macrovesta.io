import { useState } from 'react'
import InfoButton from './infoButton'
import SingleSelectDropdown from './singleSelectDropdown'
import MultipleSelectDropdown from './multipleSelectDropdown'
import LineGraphNotTime from './lineGraphNotTime'
import { getCommitmentOfTradersWeekData, getCommitmentOfTradersSeasonData } from '~/utils/getDataUtils'
import Comments from './comments'

const CommitmentOfTraders = ({ getUniqueOptions, commitmentData, commentsData, session }) => {
  const [commitmentWeek, setCommitmentWeek] = useState(1)
  const [commitmentYear, setCommitmentYear] = useState(2023)
  const [commitmentWeekOrYear, setCommitmentWeekOrYear] = useState('Year')
  const [commitmentPropertiesArray, setCommitmentPropertiesArray] = useState(['specs_net'])
  const [commitmentNamesArray, setCommitmentNamesArray] = useState(['Specs Net'])

  return (
    <div className='flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>

      <div className='grid grid-cols-2 -mb-8'>
        <div className='relative col-span-2 text-center text-xl font-semibold mb-4'>
          <InfoButton text={'The COT reports provide a breakdown of each Tuesday\'s open interest for markets in which 20 or more traders hold positions equal to or above the reporting levels established by the CFTC. The weekly reports are released every Friday at 3:30 p.m. Eastern time.'} />
          Commitment of Traders
        </div>
        <div className='col-span-3 grid grid-cols-3 w-full gap-x-4 px-8'>

          <div className='mb-4 w-full'>

            <SingleSelectDropdown
              options={[{ name: 'Week' }, { name: 'Year' }]}
              label='Week or Year'
              variable='name'
              colour='bg-deep_blue'
              onSelectionChange={(e) => setCommitmentWeekOrYear(e.name)}
              placeholder='Select Week or Year'
              searchPlaceholder='Search Options'
              includeLabel={false}
              defaultValue='Year'
            />
          </div>
          {commitmentWeekOrYear === 'Year' && (
            <>
              <div className='mb-4 w-full'>

                <SingleSelectDropdown
                  options={getUniqueOptions(JSON.parse(commitmentData), 'calendar_year')}
                  label='Year'
                  variable='value'
                  colour='bg-deep_blue'
                  onSelectionChange={(e) => setCommitmentYear(parseInt(e.value))}
                  placeholder='Select a specific year'
                  searchPlaceholder='Search Options'
                  includeLabel={false}
                  defaultValue='2023'
                />
              </div>
            </>
          )}
          {commitmentWeekOrYear === 'Week' && (
            <>
              <div className='mb-4 w-full'>

                <SingleSelectDropdown
                  options={getUniqueOptions(JSON.parse(commitmentData), 'week')}
                  label='Week'
                  variable='value'
                  colour='bg-deep_blue'
                  onSelectionChange={(e) => setCommitmentWeek(parseInt(e.value))}
                  placeholder='Select a specific week'
                  searchPlaceholder='Search Options'
                  includeLabel={false}
                  defaultValue='1'
                />
              </div>
            </>
          )}
          <div className='mb-4 w-full'>

            <MultipleSelectDropdown
              options={[{ property: 'open_interest_all', name: 'Open Interest All' }, { property: 'producer_merchant_net', name: 'Producer Merchant Net' }, { property: 'swap_position_net', name: 'Swap Position Net' }, { property: 'managed_money_long', name: 'Managed Money Long' }, { property: 'managed_money_short', name: 'Managed Money Short' }, { property: 'managed_money_net', name: 'Managed Money Net' }, { property: 'other_reportables_net', name: 'Other Reportables Net' }, { property: 'total_reportables_net', name: 'Total Reportables Net' }, { property: 'non_reportables_net', name: 'Non Reportables Net' }, { property: 'specs_net', name: 'Specs Net' }]}
              variable='name'
              colour='bg-deep_blue'
              label='Variables'
              onSelectionChange={(e) => { if (e.length > 0) { setCommitmentPropertiesArray(e.map((selection) => selection.property)); setCommitmentNamesArray(e.map((selection) => selection.name)) } }}
                      // onSelectionChange={(e) => { setCommitmentPropertiesArray(["open_interest_all"]); setCommitmentNamesArray(["Open Interest All"]) }}
              placeholder='Select Variables'
              searchPlaceholder='Search Variables'
              includeLabel={false}
            />
          </div>
        </div>

        <div className='col-span-2 flex flex-col items-center'>
          {commitmentWeekOrYear === 'Year' && (
            <>
              <div className='relative w-full text-center mt-6 -mb-2 font-semibold'>
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                Commitment of traders by Week
              </div>
              <div className='mb-16 w-full'>

                <LineGraphNotTime verticalTooltip data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) === commitmentYear), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain2={52} xAxisTitle='Week' />
              </div>
            </>
          )}
          {commitmentWeekOrYear === 'Week' && (
            <>
              <div className='relative w-full text-center mt-6 -mb-2 font-semibold'>
                <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
                Commitment of traders by Year
              </div>
              <div className='mb-16 w-full'>

                <LineGraphNotTime verticalTooltip data={getCommitmentOfTradersSeasonData(JSON.parse(commitmentData).filter((data) => parseInt(data.week) === commitmentWeek), commitmentPropertiesArray, commitmentNamesArray)} graphWidth={1000} xDomain1={2009} xDomain2={2023} xAxisTitle='Year' />
              </div>
            </>
          )}
        </div>
      </div>
      <div className='col-span-1'>
        <Comments styling='mt-2 px-8' comments={JSON.parse(commentsData).filter((comment) => comment.section === 'Commitment Of Traders')} session={session} section='Commitment Of Traders' />
      </div>
    </div>
  )
}

export default CommitmentOfTraders
