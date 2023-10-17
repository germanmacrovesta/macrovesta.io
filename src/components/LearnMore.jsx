import Link from 'next/link'

const LearnMore = () => {
  return (
    <>
      <div className='text-xl text-center mt-8'>Learn More with Macrovesta</div>
      <div className='grid grid-cols-1 xl:grid-cols-2 m-8 gap-24 text-lg'>
        <Link href={{ pathname: 'https://eapconsult.com/dashboard/' }}>
          <div className='flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center'>Learning Dash</div>
        </Link>
        <Link href={{ pathname: 'https://eapconsult.com/market-reports-2/' }}>
          <div className='flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center'>Market Reports</div>
        </Link>
      </div>
    </>
  )
}

export default LearnMore
