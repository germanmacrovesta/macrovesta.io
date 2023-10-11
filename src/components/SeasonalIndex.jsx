'use client'
import React, { useEffect, useState } from 'react'
import InfoButton from './infoButton'
import SemiCircleDial from './semiCircleDial'
import Spinner from './Spinner'
import { parseSeasonalIndex } from '~/utils/calculateUtils'

const SeasonalIndex = ({ seasonalIndexData }) => {
  const [loading, setLoading] = useState(true)
  const [dataParsed, setDataParsed] = useState({})

  useEffect(() => {
    if (seasonalIndexData) {
      const calculatedData = parseSeasonalIndex(seasonalIndexData)
      setDataParsed(calculatedData)
      setLoading(false)
    }
  }, [seasonalIndexData])

  if (loading) return <Spinner />

  return (
    <div className='relative flex flex-col justify-between'>
      <InfoButton
        text='The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. The Macrovesta Seasonal Index gives you the percentage likelihood of the current season to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month.'
      />
      <div className='text-center font-semibold'>
        Seasonal Index
      </div>
      <div className='justify-self-end'>
        <SemiCircleDial value={dataParsed} />
      </div>
      {/* {selectAppropriateImage(JSON.parse(seasonalIndexData).inverse_year, parseFloat(JSON.parse(seasonalIndexData).probability_rate))}
    <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
      transform: `rotate(${90 - (parseFloat(JSON.parse(seasonalIndexData).probability_rate) / 100 * 90) * (JSON.parse(seasonalIndexData).inverse_year == "Y" ? 1 : -1)}deg)`
    }}>

    </div>
    <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(seasonalIndexData).probability_rate}</div> */}
    </div>
  )
}

export default SeasonalIndex
