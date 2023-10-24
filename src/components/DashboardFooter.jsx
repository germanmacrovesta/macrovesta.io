import React from 'react'
import Link from 'next/link'
const DashboardFooter = () => {
  return (
    <footer className='bg-gray-200'>
      <div className='mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8'>
        <div className='flex justify-center mt-10'>
          <span className='text-sm text-gray-500 sm:text-center '>© 2023
            <Link href='https://macrovesta.ai' className='hover:underline'>Macrovesta®</Link>
            All Rights Reserved. Macrovesta is a website owned and operated by Earlam & Partners Ltd.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter
