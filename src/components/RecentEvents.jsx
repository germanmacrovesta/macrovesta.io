import { useEffect, useState } from 'react'
import { parseDateString } from '~/utils/dateUtils'
import { Select, SelectItem, Pagination, useDisclosure, Button } from '@nextui-org/react'
import Image from 'next/image'
import CustomModal from './CustomModal'

// Component only must obtain recentevents data, must split outsideComponent
// JSON.parse(snapshotsData).filter(object => object.news_type === 'Recent Events'

const RecentEvents = ({ snapshotsData, session }) => {
  // RecentEvents, Future and modal30SecsSnapshot

  // TODO: Using a global state is good idea for modals
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalType, setModalType] = useState(null)
  const [modalSection, setModalSection] = useState(null)
  const [modalSnapshotdata, setModalSnapshotData] = useState(null)

  const handleOpenModal = (type, section, snapshot) => {
    if (snapshot) {
      setModalSnapshotData(snapshot)
    } else {
      setModalSnapshotData(null)
    }

    setModalType(type)
    setModalSection(section)
    onOpen()
  }

  // TODO ---

  const [filters, setFilters] = useState({
    impact: 'High',
    show: 3
  })

  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * filters.show
  const endIndex = startIndex + filters.show

  const [filteredData, setFilteredData] = useState(JSON.parse(snapshotsData)) // Top filters data
  const [itemsToDisplay, setItemsToDisplay] = useState(filteredData.slice(startIndex, endIndex))

  // When currentPage change:
  useEffect(() => {
    const startIndex = (currentPage - 1) * parseInt(filters.show)
    const endIndex = startIndex + parseInt(filters.show)
    setItemsToDisplay(filteredData.slice(startIndex, endIndex))
  }, [currentPage])

  // When filters are applied
  useEffect(() => {
    const applyFilters = () => {
      // Filter data by diferent parameters on top of component
      // TODO: Data 'RecentEvents' must be filtered before getting on component
      let filteredResult = JSON.parse(snapshotsData).filter(object => object.news_type === 'Recent Events')
      const { impact } = filters

      if (impact !== '') {
        filteredResult = filteredResult.filter(object => object.impact === impact)
      }

      setFilteredData(filteredResult)

      // Recalculate pagination
      const startIndex = (currentPage - 1) * parseInt(filters.show)
      const endIndex = startIndex + parseInt(filters.show)

      setCurrentPage(1)
      setItemsToDisplay(filteredResult.slice(startIndex, endIndex))
    }

    applyFilters()
  }, [filters])

  const impactOptions = [{ name: 'High Impact', parameter: 'High' }, { name: 'Low impact', parameter: 'Low' }]
  const showOptions = [{ name: '3', parameter: '3' }, { name: '6', parameter: '6' }, { name: '10', parameter: '10' }]

  return (
    <div className='flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>
      <div className='flex relative items-center justify-between'>

        <h2 className='font-semibold text-2xl relative'>
          Recent Events
          {/* <InfoButton text='Find a summarised list of events which have happened over the past weeks.  ' /> */}
        </h2>

        <div className='flex justify-end gap-4 w-[50%]'>
          <Select
            radius='md'
            label='Impact'
            className='max-w-sm'
            onChange={(e) => setFilters({ ...filters, impact: e.target.value })}
            size='sm'
            placeholder='Default: All'
            variant='underlined'
            defaultSelectedKeys={['High']}
          >
            {impactOptions.map((option) => (
              <SelectItem key={option.parameter} value={option.parameter}>
                {option.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            radius='md'
            label='Show per page'
            className='max-w-xs'
            onChange={(e) => setFilters({ ...filters, show: e.target.value || 3 })}
            placeholder='Default: 3'
            size='sm'
            variant='underlined'
            defaultSelectedKeys={['3']}
          >
            {showOptions.map((option) => (
              <SelectItem key={option.parameter} value={option.parameter}>
                {option.name}
              </SelectItem>
            ))}
          </Select>
        </div>

      </div>

      <div className='grid grid-cols-2 grid-rows-1 gap-4 mt-4'>
        {!filteredData || filteredData === []
          ? ('OPS')
          : itemsToDisplay.map((snapshot, index) => (
            <div key={index} className={`${index === 0 && itemsToDisplay.length === 3 ? ' row-span-2' : ''}`}>
              <div className='h-full border relative hover:scale-[102%] transition-transform duration-300 shadow-lg rounded-lg w-full cursor-pointer flex gap-2 overflow-hidden' onClick={() => handleOpenModal('info', 'Recent Events', snapshot)}>
                <Image
                  src={snapshot?.image_of_snapshot_strategy !== '' ? snapshot?.image_of_snapshot_strategy : '/macrovesta_news_default_picture.jpg'}
                  className={`${index === 0 && itemsToDisplay.length === 3 ? 'object-cover absolute' : 'w-[150px] h-[150px] aspect-square object-cover rounded-lg'}`}
                  alt='Picture of the author'
                  height={720}
                  width={1280}
                />
                <div className={`${index === 0 && itemsToDisplay.length === 3 ? 'bg-gradient-to-t  from-black w-full h-full absolute z-10' : ''}`} />
                <div className={`${index === 0 && itemsToDisplay.length === 3 ? 'absolute bottom-0 text-white z-20 p-4' : 'flex flex-col justify-center px-2'}`}>
                  <div className='grid grid-cols-[auto_75px]'>
                    <div className='font-semibold'>
                      {snapshot.title_of_snapshot_strategy}
                    </div>
                    <div className='w-[75px]'>
                      {parseDateString(snapshot.date_of_snapshot_strategy)}
                    </div>
                  </div>
                  <div className='text-sm pt-2'>{snapshot.text_of_snapshot_strategy.length > 200 ? `${snapshot.text_of_snapshot_strategy.slice(0, 200)}...` : snapshot.text_of_snapshot_strategy}</div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className='flex items-center justify-between mt-4'>
        {/* Button Modal - Open Form */}
        {(session?.role === 'partner' || session?.role === 'admin') && (
          <div className='flex justify-center'>
            <Button
              className='bg-deep_blue text-white'
              onPress={() => handleOpenModal('form', 'Recent Events')}
            >
              Add 30 seconds Snapshot
            </Button>
          </div>
        )}
        <Pagination
          total={Math.ceil(filteredData.length / parseInt(filters.show))}
          page={currentPage}
          onChange={setCurrentPage}
          classNames={{ cursor: 'bg-deep_blue' }}
        />
      </div>

      <CustomModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        section={modalSection}
        snapshotData={modalSnapshotdata}
        type={modalType}
        session={session}
      />
    </div>
  )
}

export default RecentEvents
