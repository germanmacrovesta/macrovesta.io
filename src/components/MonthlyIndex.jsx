'use client'
import React, { useEffect, useState } from 'react'
import InfoButton from './infoButton'
import SemiCircleDial from './semiCircleDial'
import Spinner from './Spinner'
import { parseMonthlyIndex } from '~/utils/calculateUtils'

const MonthlyIndex = ({ monthlyIndexData }) => {
  const [loading, setLoading] = useState(true)
  const [dataParsed, setDataParsed] = useState({})

  useEffect(() => {
    if (monthlyIndexData) {
      const calculatedData = parseMonthlyIndex(monthlyIndexData)
      setDataParsed(calculatedData)
      setLoading(false)
    }
  }, [monthlyIndexData])

  if (loading) return <Spinner />

  return (
    <div className='relative'>
      <InfoButton text='The Macrovesta Monthly Index gives you the percentage likelihood of the current month to be either inverse and non-inverse. This indicator is directly liked to our statistical model and updated every month. ' />

      <div className='text-center font-semibold'>
        Monthly Index
      </div>
      <div className='justify-self-end'>
        {/* <SemiCircleDial value={2.66} rangeStart={-5} rangeEnd={5} arcAxisText={["-5", "-3", "0", "3", "5"]} leftText="Bearish" rightText="Bullish" decimals={1} /> */}
        <SemiCircleDial value={dataParsed} />
      </div>
      {/* {selectAppropriateImage(JSON.parse(monthlyIndexData).inverse_month, parseFloat(JSON.parse(monthlyIndexData).probability_rate))}

    <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
      transform: `rotate(${90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month == "Y" ? 1 : -1)}deg)`
    }}>

    </div>
    <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(monthlyIndexData).probability_rate}</div> */}
    </div>
  )
}

export default MonthlyIndex
