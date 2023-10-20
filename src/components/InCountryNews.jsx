import { useState, useEffect } from 'react'
import InfoButton from './infoButton'
import { parseDateString } from '~/utils/dateUtils'
import Image from 'next/image'
import { Select, SelectItem, Pagination, useDisclosure, Button } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import { useCustomModal } from '~/context/ModalContext'

// Lazy import (Modal never needed on page load)
const CustomModal = dynamic(
  () => import('./CustomModal'),
  { ssr: false }
)

const InCountryNews = ({ countryNewsData, session }) => {
  const {
    isOpen, // Boolean, determine if modal go to be rendered
    onOpen, // Open modal
    onOpenChange // When Open/close
  } = useDisclosure()

  const { openModal } = useCustomModal()

  const handleOpenModal = (type, section, data) => {
    openModal(type, section, data)
    onOpen()
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState(JSON.parse(countryNewsData))
  const [itemsToDisplay, setItemsToDisplay] = useState(filteredData)

  const [filters, setFilters] = useState({
    country: 'All Countries'
  })

  // When currentPage change:
  useEffect(() => {
    const startIndex = (currentPage - 1) * 4
    const endIndex = startIndex + 4
    setItemsToDisplay(filteredData.slice(startIndex, endIndex))
  }, [currentPage])

  const countryOptions = [{ country: 'All Countries' }, { country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]

  // When filters are applied
  useEffect(() => {
    const applyFilters = () => {
      let filteredResult = JSON.parse(countryNewsData)
      const { country } = filters

      if (country !== '' && country !== 'All Countries') {
        filteredResult = filteredResult.filter(object => object.country === country)
      }

      setFilteredData(filteredResult)
      console.log(filteredResult)

      // Recalculate pagination
      const startIndex = (currentPage - 1) * 4
      const endIndex = startIndex + 4

      setCurrentPage(1)
      setItemsToDisplay(filteredResult.slice(startIndex, endIndex))
      console.log(filteredData.slice(startIndex, endIndex))
    }

    applyFilters()
  }, [filters])

  return (
    <div className='relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg'>
      <div className='relative text-center font-semibold text-xl mb-4'>
        <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
        In Country News
      </div>
      <div className='flex justify-end'>

        <Select
          radius='md'
          label='Country'
          className='max-w-xs'
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          size='sm'
          placeholder='Default: All Countries'
          variant='underlined'
          defaultSelectedKeys={['All Countries']}
        >
          {countryOptions.map((option) => (
            <SelectItem key={option.country} value={option.country}>
              {option.country}
            </SelectItem>
          ))}
        </Select>

      </div>

      <div className='flex flex-col justify-around items-start gap-4 mt-4'>
        {itemsToDisplay.length > 0
          ? itemsToDisplay.map((news, index) => (
            <div key={index} className='border hover:scale-[102%] transition-transform duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4' onClick={() => handleOpenModal('info', 'In Country News', news)}>
              <Image
                src={news?.image_of_in_country_news !== '' ? news?.image_of_in_country_news : '/macrovesta_news_default_picture.jpg'}
                className='w-[150px] h-[150px] aspect-square object-cover rounded-lg'
                alt='Picture of the author'
                height={720}
                width={1280}
              />
              <div className='flex flex-col w-full'>
                <div className='grid grid-cols-[auto_75px]'>
                  <div className='font-semibold'>
                    {news.title_of_in_country_news}
                  </div>
                  <div className='w-[75px]'>
                    {parseDateString(news.date_of_in_country_news)}
                  </div>
                </div>
                <div className='text-sm pt-2'>{news.text_of_in_country_news.length > 200 ? `${news.text_of_in_country_news.slice(0, 200)}...` : news.text_of_in_country_news}</div>
              </div>
            </div>
          )
          )
          : (<p className='w-full text-center p-4 shadow-lg border rounded-lg'>No news for now!</p>)}
      </div>

      <div className='flex justify-between mt-10'>
        {(session?.role === 'partner' || session?.role === 'admin') && (
          <Button
            className='bg-deep_blue text-white'
            onPress={() => handleOpenModal('form', 'In Country News')}
          >
            Add 30 seconds Snapshot
          </Button>
        )}
        <Pagination
          total={filteredData.length > 0 ? Math.ceil(filteredData.length / 4) : 1}
          page={currentPage}
          onChange={setCurrentPage}
          classNames={{ cursor: 'bg-deep_blue' }}
        />
      </div>

      {isOpen && (
        <CustomModal
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          session={session}
        />
      )}
    </div>

  )
}

export default InCountryNews
